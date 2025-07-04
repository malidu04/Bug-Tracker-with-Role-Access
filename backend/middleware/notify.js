const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { sendSocketNotification } = require('../utils/realtime');

// Notify users about changes
exports.notifyUsers = async (
  senderId,
  message,
  entityId,
  entityType,
  action,
  projectId,
  mentions = []
) => {
  try {
    // Get users to notify (project members, mentioned users, etc.)
    let usersToNotify = [];
    
    // In a real app, you would query project members here
    // For now, we'll just notify mentioned users
    if (mentions.length > 0) {
      const mentionedUsers = await User.find({ 
        username: { $in: mentions } 
      }).select('_id');
      
      usersToNotify = mentionedUsers.map(user => user._id);
    }

    // Don't notify the sender
    usersToNotify = usersToNotify.filter(userId => userId.toString() !== senderId.toString());

    // Create notifications
    const notifications = usersToNotify.map(userId => ({
      user: userId,
      message,
      relatedEntity: entityId,
      entityType,
      action
    }));

    await Notification.insertMany(notifications);

    // Send real-time notifications via WebSocket
    notifications.forEach(notification => {
      sendSocketNotification(notification.user.toString(), {
        type: 'notification',
        data: notification
      });
    });

    // Send email notifications
    const usersWithEmail = await User.find({
      _id: { $in: usersToNotify },
      emailNotifications: true
    }).select('email');

    usersWithEmail.forEach(user => {
      sendEmail({
        email: user.email,
        subject: `Bug Tracker Notification: ${message}`,
        message: `You have a new notification: ${message}`
      });
    });
  } catch (err) {
    console.error('Error notifying users:', err);
  }
};