const Bug = require('../models/Bug');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorHandler');

exports.getAllBugs = async (filter = {}) => {
  try {
    const bugs = await Bug.find(filter)
      .populate('project')
      .populate('reporter')
      .populate('assignee');
    return bugs;
  } catch (error) {
    throw error;
  }
};

exports.getProjectBugs = async (projectId) => {
  try {
    const bugs = await Bug.find({ project: projectId })
      .populate('project')
      .populate('reporter')
      .populate('assignee');
    return bugs;
  } catch (error) {
    throw error;
  }
};

exports.getBugById = async (bugId) => {
  try {
    const bug = await Bug.findById(bugId)
      .populate('project')
      .populate('reporter')
      .populate('assignee');
    if (!bug) {
      throw new ErrorResponse(`Bug not found with id of ${bugId}`, 404);
    }
    return bug;
  } catch (error) {
    throw error;
  }
};

exports.createBug = async (bugData) => {
  try {
    const bug = await Bug.create(bugData);
    return bug;
  } catch (error) {
    throw error;
  }
};

exports.updateBug = async (bugId, updateData) => {
  try {
    const bug = await Bug.findByIdAndUpdate(bugId, updateData, {
      new: true,
      runValidators: true
    });
    if (!bug) {
      throw new ErrorResponse(`Bug not found with id of ${bugId}`, 404);
    }
    return bug;
  } catch (error) {
    throw error;
  }
};

exports.deleteBug = async (bugId) => {
  try {
    const bug = await Bug.findByIdAndDelete(bugId);
    if (!bug) {
      throw new ErrorResponse(`Bug not found with id of ${bugId}`, 404);
    }
    return bug;
  } catch (error) {
    throw error;
  }
};