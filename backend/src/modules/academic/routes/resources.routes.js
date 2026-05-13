const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getResources,
  createResource,
  deleteResource,
} = require("../controllers/resources.controller");
const authMiddleware = require("../../auth/authMiddleware");

// ── Multer setup ──────────────────────────────────────────────────
const uploadDir = "uploads/resources";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg", "image/png", "image/gif",
      "video/mp4", "audio/mpeg", "text/plain",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("File type not supported"));
  },
});

router.get("/", getResources);
router.post("/", authMiddleware, upload.single("file"), createResource);
router.delete("/:id", authMiddleware, deleteResource);

module.exports = router;