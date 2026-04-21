const express = require('express');
const router = express.Router();
const {
  getGroups,
  getGroupById,
  createGroup,
  deleteGroup,
  joinGroup,
} = require('../controllers/groups.controller');

// Uncomment when auth middleware is ready:
// const { protect } = require('../../middleware/auth');

// GET  /api/groups?department=CSC&year=300
router.get('/', getGroups);

// GET  /api/groups/:id
router.get('/:id', getGroupById);

// POST /api/groups
router.post('/', /* protect, */ createGroup);

//POST /api/groups/:id
router.post("/:id/join", joinGroup);

// DELETE /api/groups/:id
router.delete('/:id', /* protect, */ deleteGroup);

module.exports = router;