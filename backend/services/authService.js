const User = require('../models/User');
const ErrorResponse = require('../utils/errorHandler');

exports.registerUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    // Validate email & password
    if (!email || !password) {
      throw new ErrorResponse('Please provide an email and password', 400);
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    return user;
  } catch (error) {
    throw error;
  }
};