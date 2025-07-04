const Bug = require('../models/Bug');
const History = require('../models/History');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const { createHistory } = require('../middleware/history');
const { notifyUsers } = require('../middleware/notify');

// @desc    Get all bugs
// @route   GET /api/v1/bugs
// @route   GET /api/v1/projects/:projectId/bugs
// @access  Private
exports.getBugs = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const bugs = await Bug.find({ project: req.params.projectId })
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar');

    return res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } else {
    // If user is not admin, only show bugs they created or are assigned to
    let query;
    if (req.user.role !== 'admin') {
      query = Bug.find({
        $or: [
          { createdBy: req.user.id },
          { assignedTo: req.user.id }
        ]
      });
    } else {
      query = Bug.find();
    }

    const bugs = await query.populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  }
});

// @desc    Get single bug
// @route   GET /api/v1/bugs/:id
// @access  Private
exports.getBug = asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id)
    .populate('assignedTo', 'name avatar')
    .populate('createdBy', 'name avatar')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    })
    .populate({
      path: 'history',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has access to the bug
  if (req.user.role !== 'admin' && 
      bug.createdBy._id.toString() !== req.user.id && 
      (!bug.assignedTo || bug.assignedTo._id.toString() !== req.user.id)) {
    return next(
      new ErrorResponse(`Not authorized to access this bug`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: bug
  });
});

// @desc    Create new bug
// @route   POST /api/v1/projects/:projectId/bugs
// @access  Private
exports.createBug = [
  asyncHandler(async (req, res, next) => {
    req.body.createdBy = req.user.id;
    req.body.project = req.params.projectId;

    const bug = await Bug.create(req.body);

    // Create history entry
    await createHistory(bug._id, req.user.id, 'create', null, null, bug);

    // Notify project members
    await notifyUsers(
      req.user.id,
      `New bug created: ${bug.title}`,
      bug._id,
      'bug',
      'create',
      req.params.projectId
    );

    res.status(201).json({
      success: true,
      data: bug
    });
  })
];

// @desc    Update bug
// @route   PUT /api/v1/bugs/:id
// @access  Private
exports.updateBug = [
  asyncHandler(async (req, res, next) => {
    let bug = await Bug.findById(req.params.id);

    if (!bug) {
      return next(
        new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if user is authorized to update the bug
    if (req.user.role !== 'admin' && bug.createdBy.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to update this bug`, 401)
      );
    }

    // Check for changes to track in history
    const changes = {};
    for (const key in req.body) {
      if (bug[key] !== req.body[key]) {
        changes[key] = {
          oldValue: bug[key],
          newValue: req.body[key]
        };
      }
    }

    bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Create history entries for each change
    for (const field in changes) {
      await createHistory(
        bug._id,
        req.user.id,
        'update',
        field,
        changes[field].oldValue,
        changes[field].newValue
      );
    }

    // Notify assigned user if assignment changed
    if (changes.assignedTo) {
      await notifyUsers(
        req.user.id,
        `You've been assigned to bug: ${bug.title}`,
        bug._id,
        'bug',
        'assign',
        bug.project
      );
    }

    res.status(200).json({
      success: true,
      data: bug
    });
  })
];

// @desc    Delete bug
// @route   DELETE /api/v1/bugs/:id
// @access  Private (Admin or creator)
exports.deleteBug = asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is authorized to delete the bug
  if (req.user.role !== 'admin' && bug.createdBy.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to delete this bug`, 401)
    );
  }

  await bug.remove();

  // Create history entry
  await createHistory(bug._id, req.user.id, 'delete', null, null, null);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload attachment for bug
// @route   PUT /api/v1/bugs/:id/attachment
// @access  Private
exports.uploadAttachment = asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is authorized
  if (req.user.role !== 'admin' && bug.createdBy.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to update this bug`, 401)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `attachment_${bug._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    const attachment = {
      url: `${req.protocol}://${req.get('host')}/uploads/${file.name}`,
      name: file.name,
      type: file.mimetype,
      size: file.size
    };

    await Bug.findByIdAndUpdate(req.params.id, {
      $push: { attachments: attachment }
    });

    // Create history entry
    await createHistory(
      bug._id,
      req.user.id,
      'update',
      'attachments',
      null,
      attachment
    );

    res.status(200).json({
      success: true,
      data: attachment
    });
  });
});