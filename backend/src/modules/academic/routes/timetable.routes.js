const express = require("express");
const router = express.Router();
const { getTimetables, createTimetable, deleteTimetable } = require("../controllers/timetable.controller");

router.get("/", getTimetables);
router.post("/", createTimetable);
router.delete("/:id", deleteTimetable);

module.exports = router;