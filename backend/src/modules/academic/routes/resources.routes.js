const express = require("express");
const router = express.Router();
const {
  getResources,
  createResource,
  deleteResource,
} = require("../controllers/resources.controller");

// Uncomment the line below once your auth middleware is ready:
// const { protect } = require("../../middleware/auth");

// GET  /api/resources?department=CSC&year=300  → list resources (public)
router.get("/", getResources);

// POST /api/resources                          → contribute a resource (auth required)
router.post("/", /* protect, */ createResource);

// DELETE /api/resources/:id                    → remove own resource (auth required)
router.delete("/:id", /* protect, */ deleteResource);

module.exports = router;