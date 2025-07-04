const { getIO } = require('../config/socket');

const emitToRoom = (room, event, data) => {
  const io = getIO();
  io.to(room).emit(event, data);
};

const emitToAll = (event, data) => {
  const io = getIO();
  io.emit(event, data);
};

module.exports = { emitToRoom, emitToAll };