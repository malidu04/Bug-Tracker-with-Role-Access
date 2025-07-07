const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorHandler');

exports.getAllProjects = async (filter = {}) => {
  try {
    const projects = await Project.find(filter).populate('manager team');
    return projects;
  } catch (error) {
    throw error;
  }
};

exports.getUserProjects = async (userId) => {
  try {
    const projects = await Project.find({
      $or: [{ manager: userId }, { team: { $in: [userId] } }]
    }).populate('manager team');
    return projects;
  } catch (error) {
    throw error;
  }
};

exports.getProjectById = async (projectId) => {
  try {
    const project = await Project.findById(projectId)
      .populate('manager')
      .populate('team');
    if (!project) {
      throw new ErrorResponse(`Project not found with id of ${projectId}`, 404);
    }
    return project;
  } catch (error) {
    throw error;
  }
};

exports.createProject = async (projectData) => {
  try {
    const project = await Project.create(projectData);
    return project;
  } catch (error) {
    throw error;
  }
};

exports.updateProject = async (projectId, updateData) => {
  try {
    const project = await Project.findByIdAndUpdate(projectId, updateData, {
      new: true,
      runValidators: true
    });
    if (!project) {
      throw new ErrorResponse(`Project not found with id of ${projectId}`, 404);
    }
    return project;
  } catch (error) {
    throw error;
  }
};

exports.deleteProject = async (projectId) => {
  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      throw new ErrorResponse(`Project not found with id of ${projectId}`, 404);
    }
    return project;
  } catch (error) {
    throw error;
  }
};

exports.addTeamMember = async (projectId, userId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ErrorResponse(`Project not found with id of ${projectId}`, 404);
    }

    if (project.team.includes(userId)) {
      throw new ErrorResponse(
        `User ${userId} is already a team member`,
        400
      );
    }

    project.team.push(userId);
    await project.save();
    return project;
  } catch (error) {
    throw error;
  }
};

exports.removeTeamMember = async (projectId, userId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ErrorResponse(`Project not found with id of ${projectId}`, 404);
    }

    const index = project.team.indexOf(userId);
    if (index === -1) {
      throw new ErrorResponse(
        `User ${userId} is not a team member`,
        400
      );
    }

    project.team.splice(index, 1);
    await project.save();
    return project;
  } catch (error) {
    throw error;
  }
};