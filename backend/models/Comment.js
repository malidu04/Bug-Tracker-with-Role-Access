const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add some text'],
        trim: true,
        maxLength: [500, 'Comment cannot be more than 500 characters']
    },
    bug: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bug',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: { createdAt: true, updatedAt: false }, // Automatically handles createdAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

commentSchema.index({ bug: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);