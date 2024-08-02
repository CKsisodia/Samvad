const ChatMedia = require("../models/chatMedia");
const Chats = require("../models/chats");

module.exports = function privateMessageHandler(socket, io) {
  socket.on("private_message", async (privateMessageData) => {
    try {
      const { roomID, senderID, receiverID, message, fileMetadata } =
        privateMessageData;

      let chat = null;
      let media = null;

      if (message) {
        chat = await Chats.create({ senderID, receiverID, message });
      }

      if (fileMetadata) {
        const { size, type, url } = fileMetadata;
        media = await ChatMedia.create({
          senderID,
          receiverID,
          size,
          type,
          url,
        });
      }

      if (chat) {
        io.to(roomID).emit("receive_private_message", {
          type: "chat",
          data: chat,
        });
      }

      if (media) {
        io.to(roomID).emit("receive_private_message", {
          type: "media",
          data: media,
        });
      }
    } catch (err) {
      console.error("Error sending private message:", err);
    }
  });
};
