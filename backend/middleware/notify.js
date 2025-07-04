const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/email');

exports.notify = async (req, res, next) => {
  try {
    req.notifyUsers = async (userIds, message, relatedEntity, entityId) => {
      const notifications = userIds.map((userId) => ({
        user: userId,
        message,
        relatedEntity,
        entityId,
      }));

      const createdNotifications = await Notification.insertMany(notifications);

      // Emit socket event to each user
      const io = getIO();
      userIds.forEach((userId) => {
        io.to(userId.toString()).emit('notification', {
          message,
          relatedEntity,
          entityId,
        });
      });

      // TODO: Implement email notifications if needed
      // await sendEmail(...);
    };

    next();
  } catch (err) {
    return next(new ErrorResponse('Error setting up notifications', 500));
  }
};