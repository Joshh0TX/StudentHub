const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Shared response shaper — used by getResources and createResource to keep
// the response shape in sync. Returns createdBy (for frontend ownership check),
// category (for visual tag), and creator.name (for "by X" display).
const shapeResource = (r) => ({
  id: r.id,
  title: r.title,
  type: r.type,
  category: r.category ?? null,
  url: r.url,
  description: r.description,
  department: r.department,
  year: r.year,
  isFile: r.isFile,
  fileName: r.fileName,
  fileSize: r.fileSize,
  mimeType: r.mimeType,
  createdAt: r.createdAt,
  createdBy: r.uploadedBy,
  uploadedBy: r.uploadedBy,
  courseCode: r.courseCode,
  course_code: r.courseCode,
  courseTitle: r.courseTitle ?? r.courseCode,
  course_title: r.courseTitle ?? r.courseCode,
  creator: r.uploader
    ? {
        id: r.uploader.id,
        name: `${r.uploader.f_name} ${r.uploader.l_name}`.trim(),
        email: r.uploader.email,
        image: r.uploader.profileImage,
      }
    : null,
});

const uploaderSelect = {
  id: true,
  f_name: true,
  l_name: true,
  profileImage: true,
  email: true,
};

/**
 * GET /api/resources?department=CSC&year=300
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
      include: { uploader: { select: uploaderSelect } },
    });

    return res.json(resources.map(shapeResource));
  } catch (err) {
    console.error("[getResources]", err);
    return res.status(500).json({ error: "Failed to fetch resources" });
  }
};

/**
 * POST /api/resources
 */
const createResource = async (req, res) => {
  const uploadedBy = req.user.id;

  const {
    title,
    type,
    category,
    url,
    description,
    department,
    courseCode,
    courseTitle,
    year,
    groupId,
  } = req.body;

  if (!url && !req.file) {
    return res
      .status(400)
      .json({ error: "Please provide either a link or upload a file" });
  }

  const missing = ["title", "type", "department", "courseCode"].filter(
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
    const fileUrl = req.file ? req.file.path : url;

    const resource = await prisma.resource.create({
      data: {
        title,
        type,
        category: category ?? null,
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
      include: { uploader: { select: uploaderSelect } },
    });

    return res.status(201).json(shapeResource(resource));
  } catch (err) {
    console.error("[createResource]", err);
    return res.status(500).json({ error: "Failed to create resource" });
  }
};

/**
 * DELETE /api/resources/:id
 */
const deleteResource = async (req, res) => {
  const { id } = req.params;
  const requesterId = req.user.id;

  try {
    const resource = await prisma.resource.findUnique({ where: { id } });

    if (!resource) return res.status(404).json({ error: "Resource not found" });
    if (String(resource.uploadedBy) !== String(requesterId)) {
      return res
        .status(403)
        .json({ error: "Not authorised to delete this resource" });
    }

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
