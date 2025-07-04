const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxLength: [300, 'Notification message cannot exceed 300 characters']
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})