const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /api/resources?department=CSC&year=300
 *
 * Returns a flat array of resources filtered by department and (optionally) year.
 * The frontend groups them by course_code itself, so we just return flat rows.
 */
const getResources = async (req, res) => {
  const { department, year } = req.query;

  if (!department) {
    return res
      .status(400)
      .json({ error: "department query param is required" });
  }

  try {
    const where = { department };
    if (year) where.year = parseInt(year, 10);

    const resources = await prisma.resource.findMany({
      where,
      orderBy: [{ courseCode: "asc" }, { createdAt: "desc" }],
      include: {
        uploader: {
          select: {
            id: true,
            f_name: true,
            l_name: true,
            profileImage: true,
            email: true,
          }
        }
      },
    });

    // Shape each row to match what Resources.jsx expects
    const shaped = resources.map((r) => ({
      id: r.id,
      course_code: r.courseCode,
      course_title: r.courseTitle ?? r.courseCode, // fallback if title missing
      title: r.title,
      type: r.type, // "pdf" | "link" | "video" | "notes"
      url: r.url,
      description: r.description,
      department: r.department,
      year: r.year,
      uploadedBy: r.uploader,
      createdAt: r.createdAt,
    }));

    return res.json(shaped);
  } catch (err) {
    console.error("[getResources]", err);
    return res.status(500).json({ error: "Failed to fetch resources" });
  }
};

/**
 * POST /api/resources
 *
 * Body (JSON):
 * {
 *   title:       "Data Structures – Past Questions",
 *   type:        "pdf",           // pdf | link | video | notes
 *   url:         "https://...",
 *   description: "Very helpful for the exam",
 *   department:  "CSC",
 *   courseCode:  "CSC301",
 *   courseTitle: "Data Structures",
 *   year:        300,             // optional
 *   groupId:     "uuid"          // optional – ties resource to a study group
 * }
 *
 * Auth: expects req.user to be set by auth middleware.
 * During development without auth, falls back to a placeholder.
 */
const createResource = async (req, res) => {
  const uploadedBy = req.user?.id ?? "user-unique-id-002"; // swap when auth is live

  const {
    title,
    type,
    url,
    description,
    department,
    courseCode,
    courseTitle,
    year,
    groupId,
  } = req.body;

  // Basic validation
  const missing = ["title", "type", "url", "department", "courseCode"].filter(
    (f) => !req.body[f],
  );
  if (missing.length) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  const validTypes = ["pdf", "link", "video", "notes"];
  if (!validTypes.includes(type)) {
    return res
      .status(400)
      .json({ error: `type must be one of: ${validTypes.join(", ")}` });
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        type,
        url,
        description: description ?? null,
        department,
        courseCode,
        courseTitle: courseTitle ?? null,
        year: year ? parseInt(year, 10) : null,
        groupId: groupId ?? null,
        uploadedBy,
      },
      include: {
        uploader: {
          select: {
            id: true,
            f_name: true,
            l_name: true,
            profileImage: true,
            email: true,
          }
        }
      },
    });

    return res.status(201).json({
      id: resource.id,
      course_code: resource.courseCode,
      course_title: resource.courseTitle ?? resource.courseCode,
      title: resource.title,
      type: resource.type,
      url: resource.url,
      description: resource.description,
      department: resource.department,
      year: resource.year,
      uploadedBy: resource.uploader,
      createdAt: resource.createdAt,
    });
  } catch (err) {
    console.error("[createResource]", err);
    return res.status(500).json({ error: "Failed to create resource" });
  }
};

/**
 * DELETE /api/resources/:id
 *
 * Only the uploader can delete their own resource.
 */
const deleteResource = async (req, res) => {
  const { id } = req.params;
  const requesterId = req.user?.id ?? "test-user-123";

  try {
    const resource = await prisma.resource.findUnique({ where: { id } });

    if (!resource) return res.status(404).json({ error: "Resource not found" });
    if (resource.uploadedBy !== requesterId) {
      return res
        .status(403)
        .json({ error: "Not authorised to delete this resource" });
    }

    await prisma.resource.delete({ where: { id } });
    return res.json({ message: "Resource deleted" });
  } catch (err) {
    console.error("[deleteResource]", err);
    return res.status(500).json({ error: "Failed to delete resource" });
  }
};

module.exports = { getResources, createResource, deleteResource };
