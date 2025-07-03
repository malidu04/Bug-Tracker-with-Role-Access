const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    stepsToReproduce: {
        type: String,
        required: true,
    },
    expectedBehavior: {
        type: String,
        required: true,
    },
    actualBehavior: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'fixed', 'wontfix', 'duplicate'],
        default: 'open',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    screenshot: {
        type: String,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    seen: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Bug', BugSchema);