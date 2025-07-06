const Bug = require('../models/Bug');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all bugs
// @route   GET /api/v1/bugs
// @route   GET /api/v1/projects/:projectId/bugs
// @access  Private
exports.getBugs = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const bugs = await Bug.find({ project: req.params.projectId })
      .populate('project')
      .populate('reporter')
      .populate('assignee');

    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(
        new ErrorResponse(
          `Project not found with id of ${req.params.projectId}`,
          404
        )
      );
    }

    if (
      project.manager.toString() !== req.user.id &&
      !project.team.includes(req.user.id) &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access bugs for this project`,
          401
        )
      );
    }

    return res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs
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
    .populate('project')
    .populate('reporter')
    .populate('assignee');

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has access to the project
  const project = await Project.findById(bug.project);

  if (
    project.manager.toString() !== req.user.id &&
    !project.team.includes(req.user.id) &&
    bug.reporter._id.toString() !== req.user.id &&
    (bug.assignee && bug.assignee._id.toString() !== req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this bug`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bug
  });
});

// @desc    Create bug
// @route   POST /api/v1/projects/:projectId/bugs
// @access  Private
exports.createBug = asyncHandler(async (req, res, next) => {
  req.body.project = req.params.projectId;
  req.body.reporter = req.user.id;

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(
      new ErrorResponse(
        `Project not found with id of ${req.params.projectId}`,
        404
      )
    );
  }

  // Check if user has access to the project
  if (
    project.manager.toString() !== req.user.id &&
    !project.team.includes(req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add bugs to this project`,
        401
      )
    );
  }

  const bug = await Bug.create(req.body);

  res.status(201).json({
    success: true,
    data: bug
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

  // Check if user has access to the project
  const project = await Project.findById(bug.project);

  if (
    project.manager.toString() !== req.user.id &&
    !project.team.includes(req.user.id) &&
    bug.reporter.toString() !== req.user.id &&
    (bug.assignee && bug.assignee.toString() !== req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this bug`,
        401
      )
    );
  }

  // If assignee is being updated, verify the new assignee is part of the project team
  if (req.body.assignee) {
    if (!project.team.includes(req.body.assignee)) {
      return next(
        new ErrorResponse(
          `Assignee must be a team member of the project`,
          400
        )
      );
    }
  }

  bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: bug
  });
});

// @desc    Delete bug
// @route   DELETE /api/v1/bugs/:id
// @access  Private
exports.deleteBug = asyncHandler(async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    return next(
      new ErrorResponse(`Bug not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has access to the project
  const project = await Project.findById(bug.project);

  if (
    project.manager.toString() !== req.user.id &&
    bug.reporter.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this bug`,
        401
      )
    );
  }

  await bug.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});