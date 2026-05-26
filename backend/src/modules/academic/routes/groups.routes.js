const express = require("express");
const router = express.Router();
const {
  getGroups,
  getGroupById,
  getMyGroups,
  createGroup,
  deleteGroup,
  joinGroup,
  createSchedule,
} = require("../controllers/groups.controller");
const { canCreate, scopedToOwn } = require("../../../middleware/rbac");
const authMiddleware = require("../../auth/authMiddleware");

router.get("/", getGroups);
router.get("/my-groups", authMiddleware, getMyGroups);
router.get("/:id", getGroupById);
router.post("/", authMiddleware, canCreate, scopedToOwn, createGroup);
router.post("/:id/join", authMiddleware, joinGroup);
router.delete("/:id", authMiddleware, canCreate, deleteGroup);
router.post("/:id/schedules", authMiddleware, createSchedule);

module.exports = router;
