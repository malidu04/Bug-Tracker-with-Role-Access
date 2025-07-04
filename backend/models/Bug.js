const mongoose = require('mongoose');
const History = require('./History');

const bugSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxLength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxLength: [1000, 'Description cannot be more than 1000 characters']
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    type: {
        type: String,
        enum: ['bug', 'feature', 'task', 'improvement'],
        default: 'bug'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    dueDate: {
        type: Date
    },
    attachments: [{
        url: String,
        name: String,
        type: String,
        size: Number
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

bugSchema.index({ project: 1, status: 1, assignedTo: 1 });

bugSchema.pre('remove', async function (next) {
    await this.model('Comment').deleteMany({ bug: this._id });
    await History.deleteMany({ bug: this._id });
    next();    
});

bugSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'bug',
    justOne: false
});

bugSchema.virtual('history', {
  ref: 'History',
  localField: '_id',
  foreignField: 'bug',
  justOne: false
});

module.exports = mongoose.model('Bug', BugSchema);