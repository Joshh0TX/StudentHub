const express = require("express");
const router = express.Router();
const {
  getResources,
  createResource,
  deleteResource,
} = require("../controllers/resources.controller");
const authMiddleware = require("../../auth/authMiddleware");

router.get("/", getResources);
router.post("/", authMiddleware, createResource);
router.delete("/:id", authMiddleware, deleteResource);

module.exports = router;