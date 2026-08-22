let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 [Socket.IO] New client connected: ${socket.id}`);

    // Join Admin Command Center Room
    socket.on('join:admin', (data) => {
      socket.join('admin_room');
      console.log(`🛡️ [Socket] Client ${socket.id} joined admin_room (${data?.name || 'Administrator'})`);
      socket.emit('joined:admin_ack', { status: 'connected', time: new Date() });
    });

    // Join Student Emergency Room
    socket.on('join:student', (data) => {
      const studentId = data?.studentId || socket.id;
      socket.join(`student_${studentId}`);
      console.log(`🎓 [Socket] Student ${socket.id} joined student_${studentId}`);
      socket.emit('joined:student_ack', { status: 'connected', studentId });
    });

    // Live GPS Ping from Student App
    socket.on('student:location_ping', (data) => {
      // Forward directly to all admins
      io.to('admin_room').emit('student:location_update', {
        ...data,
        receivedAt: new Date(),
      });
    });

    // Responder live location update
    socket.on('responder:location_ping', (data) => {
      io.emit('responder:location_update', {
        ...data,
        receivedAt: new Date(),
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ [Socket.IO] Client disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

const getIO = () => {
  return ioInstance;
};

module.exports = {
  initSocket,
  getIO,
};
