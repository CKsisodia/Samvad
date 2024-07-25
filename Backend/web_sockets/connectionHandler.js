module.exports = function connectionHandler(socket) {
  socket.on("join_room", (roomID) => {
    socket.join(roomID);
    console.log(`User joined room: ${roomID}`);
  });

  socket.on("leave_room", (roomID) => {
    socket.leave(roomID);
    console.log(`User left room: ${roomID}`);
  });
};
