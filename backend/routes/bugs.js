const express = require('express');
const router = express.Router();
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
} = require('../controllers/bugs');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Bug = require('../models/Bug');

// Re-route into other resource routers
router.use('/:bugId/comments', require('./comments'));
router.use('/:bugId/history', require('./history'));

router.route('/')
  .get(
    advancedResults(Bug, [
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]),
    getBugs
  )
  .post(protect, authorize('admin', 'tester'), createBug);

router.route('/:id')
  .get(getBug)
  .put(protect, updateBug)
  .delete(protect, authorize('admin'), deleteBug);

module.exports = router;