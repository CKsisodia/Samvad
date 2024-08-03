const Chats = require("../models/chats");

module.exports = function privateMessageHandler(socket, io) {
  socket.on("private_message", async (privateMessageData) => {
    try {
      const { roomID, senderID, receiverID, message, fileMetadata } =
        privateMessageData;

      let chat = null;

      if (message) {
        chat = await Chats.create({
          senderID,
          receiverID,
          message,
          status: "text",
        });
      }

      if (fileMetadata) {
        const { size, type, url } = fileMetadata;
        chat = await Chats.create({
          senderID,
          receiverID,
          size,
          type,
          url,
          status: "media",
        });
      }

      if (chat) {
        io.to(roomID).emit("receive_private_message", chat);
      }
    } catch (err) {
      console.error("Error sending private message:", err);
    }
  });
};
