const socketio = require('socket.io');

let io;

exports.init = server => {
  io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', socket => {
    console.log('New client connected');

    // Join user-specific room for notifications
    socket.on('join', userId => {
      socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};