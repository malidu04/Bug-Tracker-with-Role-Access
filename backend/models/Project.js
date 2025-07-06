const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  manager: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  team: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Cascade delete bugs when a project is deleted
ProjectSchema.pre('remove', async function(next) {
  await this.model('Bug').deleteMany({ project: this._id });
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);