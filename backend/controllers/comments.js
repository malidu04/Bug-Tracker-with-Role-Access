const Comment = require('../models/Comment');
const Bug = require('../models/Bug');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get comments for a bug
// @route   GET /api/v1/bugs/:bugId/comments
// @access  Private
exports.getComments = asyncHandler(async (req, res, next) => {
  if (req.params.bugId) {
    const comments = await Comment.find({ bug: req.params.bugId }).populate(
      'user',
      'name email'
    );

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Add comment to bug
// @route   POST /api/v1/bugs/:bugId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  req.body.bug = req.params.bugId;
  req.body.user = req.user.id;

  const bug = await Bug.findById(req.params.bugId);

  if (!bug) {
    return next(
      new ErrorResponse(`No bug with the id of ${req.params.bugId}`, 404)
    );
  }

  const comment = await Comment.create(req.body);

  // Notify bug creator and assignee
  if (req.notifyUsers) {
    const usersToNotify = new Set();
    if (bug.createdBy) usersToNotify.add(bug.createdBy.toString());
    if (bug.assignedTo) usersToNotify.add(bug.assignedTo.toString());
    
    // Don't notify the comment author
    usersToNotify.delete(req.user.id.toString());

    if (usersToNotify.size > 0) {
      await req.notifyUsers(
        Array.from(usersToNotify),
        `New comment on bug: ${bug.title}`,
        'comment',
        comment._id
      );
    }
  }

  res.status(201).json({
    success: true,
    data: comment,
  });
});

// @desc    Update comment
// @route   PUT /api/v1/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure comment belongs to user or user is admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to update this comment`, 401)
    );
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure comment belongs to user or user is admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to delete this comment`, 401)
    );
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});