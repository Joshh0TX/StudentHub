const express = require("express");
const router = express.Router();
const { getTimetables, createTimetable, updateTimetable, deleteTimetable } = require("../controllers/timetable.controller");
const { canCreate, scopedToOwn } = require("../../../middleware/rbac");
const authMiddleware = require("../../auth/authMiddleware");

router.get("/", getTimetables);
router.post("/", authMiddleware, canCreate, scopedToOwn, createTimetable);
router.put("/:id", authMiddleware, canCreate, updateTimetable);
router.delete("/:id", authMiddleware, canCreate, deleteTimetable);

module.exports = router;