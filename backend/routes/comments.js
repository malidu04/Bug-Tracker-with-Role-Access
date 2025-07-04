const express = require('express');
const router = express.Router();
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getComments)
  .post(protect, addComment);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;