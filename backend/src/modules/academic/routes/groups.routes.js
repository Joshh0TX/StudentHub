const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth.middleware');
const {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup
} = require('../controllers/groups.controller');

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.post('/:id/join', joinGroup);

module.exports = router;