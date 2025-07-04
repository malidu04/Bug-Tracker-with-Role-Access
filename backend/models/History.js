const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  bug: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bug',
    required: true,
  },
  field: {
    type: String,
    required: true,
    enum: ['status', 'assignedTo', 'priority', 'title', 'description'],
  },
  oldValue: {
    type: String,
  },
  newValue: {
    type: String,
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', HistorySchema);