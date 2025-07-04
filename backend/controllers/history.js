const History = require('../models/History');
const Bug = require('../models/Bug');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get history for a bug
// @route   GET /api/v1/bugs/:bugId/history
// @access  Private
exports.getHistory = asyncHandler(async (req, res, next) => {
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
      new ErrorResponse(`Not authorized to access this bug's history`, 401)
    );
  }

  const history = await History.find({ bug: req.params.bugId })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: history.length,
    data: history
  });
});

// @desc    Get all history (Admin only)
// @route   GET /api/v1/history
// @access  Private/Admin
exports.getAllHistory = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to access this resource`, 401)
    );
  }

  const history = await History.find()
    .populate('user', 'name avatar')
    .populate('bug', 'title')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: history.length,
    data: history
  });
});