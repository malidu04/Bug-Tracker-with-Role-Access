const History = require('../models/History');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get history for a bug
// @route   GET /api/v1/bugs/:bugId/history
// @access  Private
exports.getBugHistory = asyncHandler(async (req, res, next) => {
  const history = await History.find({ bug: req.params.bugId })
    .populate('changedBy', 'name email')
    .sort('-changedAt');

  res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
});

// @desc    Get all history (admin only)
// @route   GET /api/v1/history
// @access  Private/Admin
exports.getAllHistory = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});