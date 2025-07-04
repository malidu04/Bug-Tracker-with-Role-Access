const express = require('express');
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
  uploadAttachment
} = require('../controllers/bugs');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getBugs)
  .post(protect, authorize('qa', 'admin', 'project-manager'), createBug);

router
  .route('/:id')
  .get(protect, getBug)
  .put(protect, authorize('qa', 'admin', 'project-manager'), updateBug)
  .delete(protect, authorize('qa', 'admin', 'project-manager'), deleteBug);

router
  .route('/:id/attachment')
  .put(protect, authorize('qa', 'admin', 'project-manager'), upload.single('file'), uploadAttachment);

module.exports = router;