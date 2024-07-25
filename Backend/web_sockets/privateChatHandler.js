const Chats = require("../models/chats");

module.exports = function privateMessageHandler(socket, io) {
  socket.on("private_message", async (privateMessageData) => {
    try {
      const { roomID, senderID, receiverID, message } = privateMessageData;
      const chat = await Chats.create({ senderID, receiverID, message });

      if (chat) {
        io.to(roomID).emit("receive_private_message", chat);
      }
    } catch (err) {
      console.error("Error sending private message:", err);
    }
  });
};
