const User = require('../models/User');
const ErrorResponse = require('../utils/errorHandler');

exports.getAllUsers = async (filter = {}) => {
  try {
    const users = await User.find(filter);
    return users;
  } catch (error) {
    throw error;
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorResponse(`User not found with id of ${userId}`, 404);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });
    if (!user) {
      throw new ErrorResponse(`User not found with id of ${userId}`, 404);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

exports.deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new ErrorResponse(`User not found with id of ${userId}`, 404);
    }
    return user;
  } catch (error) {
    throw error;
  }
};