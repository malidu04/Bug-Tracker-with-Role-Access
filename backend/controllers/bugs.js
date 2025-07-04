const Bug = require('../models/Bug');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const { emitToRoom } = require('../utils/realtime');

// @desc    Get all bugs
// @route   GET /api/v1/bugs
// @route   GET /api/v1/projects/:projectId/bugs
// @access  Private
exports.getBugs = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const bugs = await Bug.find({ project: req.params.projectId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    return res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single bug
// @route   GET /api/v1/bugs/:id
// @access  Private
exports.getBug = asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bug,
  });
});

// @desc    Create new bug
// @route   POST /api/v1/bugs
// @access  Private (admin, tester)
exports.createBug = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const bug = await Bug.create(req.body);

  // Notify admins and developers
  if (req.notifyUsers) {
    const adminsAndDevs = await User.find({
      role: { $in: ['admin', 'developer'] },
    }).select('_id');
    
    const userIds = adminsAndDevs.map(user => user._id);
    await req.notifyUsers(
      userIds,
      `New bug created: ${bug.title}`,
      'bug',
      bug._id
    );
  }

  res.status(201).json({
    success: true,
    data: bug,
  });
});

// @desc    Update bug
// @route   PUT /api/v1/bugs/:id
// @access  Private
exports.updateBug = asyncHandler(async (req, res, next) => {
  let bug = await Bug.findById(req.params.id);

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bug creator, admin or assigned developer
  if (
    bug.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    (bug.assignedTo && bug.assignedTo.toString() !== req.user.id)
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this bug`,
        401
      )
    );
  }

  // Track changes before updating
  await req.onUpdate(bug);

  bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Notify relevant users if status or assignee changed
  if (req.body.status || req.body.assignedTo) {
    const usersToNotify = new Set();
    
    if (bug.createdBy) usersToNotify.add(bug.createdBy.toString());
    if (bug.assignedTo) usersToNotify.add(bug.assignedTo.toString());
    
    if (req.notifyUsers && usersToNotify.size > 0) {
      await req.notifyUsers(
        Array.from(usersToNotify),
        `Bug updated: ${bug.title}`,
        'bug',
        bug._id
      );
    }
  }

  res.status(200).json({
    success: true,
    data: bug,
  });
});

// @desc    Delete bug
// @route   DELETE /api/v1/bugs/:id
// @access  Private (admin, creator)
exports.deleteBug = asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bug creator or admin
  if (bug.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this bug`,
        401
      )
    );
  }

  await bug.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});