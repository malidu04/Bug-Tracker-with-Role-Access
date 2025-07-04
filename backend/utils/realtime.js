const socket = require('../config/socket');

// Send real-time notification via WebSocket
exports.sendSocketNotification = (userId, data) => {
  const io = socket.getIO();
  if (io) {
    io.to(`user_${userId}`).emit('notification', data);
  }
};