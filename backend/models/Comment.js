const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add some text'],
    maxlength: [500, 'Comment cannot be more than 500 characters'],
  },
  bug: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bug',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);