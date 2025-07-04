const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  bug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bug',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'status-change', 'assign']
  },
  field: {
    type: String,
    trim: true
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Automatically adds createdAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Optional index for performance on common queries
historySchema.index({ bug: 1, createdAt: -1 });

module.exports = mongoose.model('History', historySchema);
