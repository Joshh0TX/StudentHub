const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/resources
const getResources = async (req, res) => {
  const { department, year } = req.query;

  if (!department) {
    return res.status(400).json({ error: "department query param is required" });
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
          },
        },
      },
    });

    const shaped = resources.map((r) => ({
      id: r.id,
      course_code: r.courseCode,
      course_title: r.courseTitle ?? r.courseCode,
      title: r.title,
      type: r.type,
      url: r.url,
      description: r.description,
      department: r.department,
      year: r.year,
      isFile: r.isFile,
      fileName: r.fileName,
      fileSize: r.fileSize,
      mimeType: r.mimeType,
      uploadedBy: r.uploader,
      createdAt: r.createdAt,
    }));

    return res.json(shaped);
  } catch (err) {
    console.error("[getResources]", err);
    return res.status(500).json({ error: "Failed to fetch resources" });
  }
};

// POST /api/resources
const createResource = async (req, res) => {
  const { id: uploadedBy, role, courseRepOf } = req.user;

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

  if (role === "student")
    return res.status(403).json({ error: "Students cannot create resources." });

  if (role === "course_rep") {
    if (!courseRepOf ||
      courseRepOf.department !== department ||
      courseRepOf.level !== Number(year)) {
      return res.status(403).json({
        error: "Course reps can only create within their own department and year.",
      });
    }
  }

  if (!url && !req.file)
    return res.status(400).json({ error: "Please provide either a link or upload a file" });

  const missing = ["title", "type", "department", "courseCode"].filter(
    (f) => !req.body[f]
  );
  if (missing.length)
    return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });

  const validTypes = ["pdf", "link", "video", "notes"];
  if (!validTypes.includes(type))
    return res.status(400).json({ error: `type must be one of: ${validTypes.join(", ")}` });

  try {
    const fileUrl = req.file ? req.file.path : url;

    const resource = await prisma.resource.create({
      data: {
        title,
        type,
        url: fileUrl,
        description: description ?? null,
        department,
        courseCode,
        courseTitle: courseTitle ?? null,
        year: year ? parseInt(year, 10) : null,
        groupId: groupId ?? null,
        uploadedBy,
        isFile: !!req.file,
        fileName: req.file?.originalname ?? null,
        fileSize: req.file?.size ?? null,
        mimeType: req.file?.mimetype ?? null,
      },
      include: {
        uploader: {
          select: {
            id: true,
            f_name: true,
            l_name: true,
            profileImage: true,
            email: true,
          },
        },
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
      isFile: resource.isFile,
      fileName: resource.fileName,
      fileSize: resource.fileSize,
      mimeType: resource.mimeType,
      uploadedBy: resource.uploader,
      createdAt: resource.createdAt,
    });
  } catch (err) {
    console.error("[createResource]", err);
    return res.status(500).json({ error: "Failed to create resource" });
  }
};

// DELETE /api/resources/:id
const deleteResource = async (req, res) => {
  const { id } = req.params;
  const { id: requesterId, role, courseRepOf } = req.user;

  try {
    const resource = await prisma.resource.findUnique({ where: { id } });

    if (!resource) return res.status(404).json({ error: "Resource not found" });

    const isOwner = resource.uploadedBy === requesterId;
    const isAdmin = role === "admin";
    const isCourseRep = role === "course_rep" &&
      courseRepOf?.department === resource.department &&
      courseRepOf?.level === resource.year;

    if (!isOwner && !isAdmin && !isCourseRep)
      return res.status(403).json({ error: "Not authorised to delete this resource" });

    if (resource.isFile && resource.url) {
      const publicId = resource.url
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
    }

    await prisma.resource.delete({ where: { id } });
    return res.json({ message: "Resource deleted" });
  } catch (err) {
    console.error("[deleteResource]", err);
    return res.status(500).json({ error: "Failed to delete resource" });
  }
};

module.exports = { getResources, createResource, deleteResource };