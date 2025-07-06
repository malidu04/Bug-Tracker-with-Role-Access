const User = require('../models/User');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getUsers = asyncHandler(async( req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getUser = asyncHandler(async(req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    date: user
  });
});

exports.createUser = asyncHandler(async(req, res, next)=> {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user
  });
});

exports.updateUser = asyncHandler(async(req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if(!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if(!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    data: {}
  });
});