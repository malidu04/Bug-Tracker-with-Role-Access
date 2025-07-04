const Comment = require('../models/Comment');
const Bug = require('../models/Bug');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const { notifyUsers } = require('../middleware/notify');

// @desc    Get comments for a bug
// @route   GET /api/v1/bugs/:bugId/comments
// @access  Private
exports.getComments = asyncHandler(async (req, res, next) => {
  // Check if bug exists
  const bug = await Bug.findById(req.params.bugId);

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.bugId}`, 404)
    );
  }

  // Check if user has access to the bug
  if (req.user.role !== 'admin' && 
      bug.createdBy.toString() !== req.user.id && 
      (!bug.assignedTo || bug.assignedTo.toString() !== req.user.id)) {
    return next(
      new ErrorResponse(`Not authorized to access this bug's comments`, 401)
    );
  }

  const comments = await Comment.find({ bug: req.params.bugId })
    .populate('user', 'name avatar');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Add comment to bug
// @route   POST /api/v1/bugs/:bugId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  req.body.bug = req.params.bugId;
  req.body.user = req.user.id;

  // Check if bug exists
  const bug = await Bug.findById(req.params.bugId);

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.bugId}`, 404)
    );
  }

  // Check if user has access to the bug
  if (req.user.role !== 'admin' && 
      bug.createdBy.toString() !== req.user.id && 
      (!bug.assignedTo || bug.assignedTo.toString() !== req.user.id)) {
    return next(
      new ErrorResponse(`Not authorized to comment on this bug`, 401)
    );
  }

  const comment = await Comment.create(req.body);

  // Check for mentions in comment
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  let mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(req.body.text)) !== null) {
    mentions.push(match[1]);
  }

  // Notify mentioned users and bug assignee/creator
  await notifyUsers(
    req.user.id,
    `New comment on bug: ${bug.title}`,
    bug._id,
    'comment',
    'create',
    bug.project,
    mentions
  );

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Update comment
// @route   PUT /api/v1/comments/:id
// @access  Private (Comment owner or admin)
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is authorized to update the comment
  if (req.user.role !== 'admin' && comment.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to update this comment`, 401)
    );
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
// @access  Private (Comment owner or admin)
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is authorized to delete the comment
  if (req.user.role !== 'admin' && comment.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to delete this comment`, 401)
    );
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});