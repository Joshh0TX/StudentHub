const express = require('express');
const router = express.Router();
const {
  getGroups,
  getGroupById,
  getMyGroups,
  createGroup,
  deleteGroup,
  joinGroup,
} = require('../controllers/groups.controller');
const authMiddleware = require('../../auth/authMiddleware');

router.get('/', getGroups);
router.get("/my-groups", authMiddleware, getMyGroups);
router.get("/:id", getGroupById);
router.post('/', authMiddleware, createGroup);
router.post("/:id/join", authMiddleware, joinGroup);
router.delete('/:id', authMiddleware, deleteGroup);

module.exports = router;