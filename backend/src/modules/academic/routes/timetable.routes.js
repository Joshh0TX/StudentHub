const express = require("express");
const router = express.Router();
const { getTimetables, createTimetable, deleteTimetable } = require("../controllers/timetable.controller");
const authMiddleware = require("../../auth/authMiddleware");

router.get("/", getTimetables);
router.post("/", authMiddleware, createTimetable);
router.delete("/:id", authMiddleware, deleteTimetable);

module.exports = router;