const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all projects
// @route   GET /api/v1/projects
// @route   GET /api/v1/users/:userId/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const projects = await Project.find({
      $or: [
        { manager: req.params.userId },
        { team: { $in: [req.params.userId] } }
      ]
    }).populate('manager team');

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('manager')
    .populate('team');

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is manager or team member
  if (
    project.manager._id.toString() !== req.user.id &&
    !project.team.some(member => member._id.toString() === req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this project`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create project
// @route   POST /api/v1/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.manager = req.user.id;

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (
    project.manager.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this project`,
        401
      )
    );
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (
    project.manager.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this project`,
        401
      )
    );
  }

  await project.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add team member to project
// @route   PUT /api/v1/projects/:id/team
// @access  Private
exports.addTeamMember = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (
    project.manager.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this project`,
        401
      )
    );
  }

  // Check if member is already in team
  if (project.team.includes(req.body.userId)) {
    return next(
      new ErrorResponse(
        `User ${req.body.userId} is already a team member`,
        400
      )
    );
  }

  project.team.push(req.body.userId);
  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Remove team member from project
// @route   DELETE /api/v1/projects/:id/team/:userId
// @access  Private
exports.removeTeamMember = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (
    project.manager.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this project`,
        401
      )
    );
  }

  // Check if member is in team
  const index = project.team.indexOf(req.params.userId);
  if (index === -1) {
    return next(
      new ErrorResponse(
        `User ${req.params.userId} is not a team member`,
        400
      )
    );
  }

  project.team.splice(index, 1);
  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});