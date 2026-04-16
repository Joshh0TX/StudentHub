const express = require('express');
const router = express.Router();
const {
  getGroups,
  getGroupById,
  createGroup,
  deleteGroup,
} = require('../controllers/groups.controller');

// Uncomment when auth middleware is ready:
// const { protect } = require('../../middleware/auth');

// GET  /api/groups?department=CSC&year=300
router.get('/', getGroups);

// GET  /api/groups/:id
router.get('/:id', getGroupById);

// POST /api/groups
router.post('/', /* protect, */ createGroup);

// DELETE /api/groups/:id
router.delete('/:id', /* protect, */ deleteGroup);

module.exports = router;