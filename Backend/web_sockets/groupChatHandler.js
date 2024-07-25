const GroupChats = require("../models/groupChats");

module.exports = function groupMessageHandler(socket, io) {
  socket.on("group_message", async (groupMessageData) => {
    try {
      const { roomID, senderID, groupID, message, senderName } =
        groupMessageData;

      const getRandomDarkColor = () => {
        const colorsArr = [
          "#0561f5",
          "#f50505",
          "#f5dd05",
          "#05f505",
          "#05f5cd",
          "#0541f5",
          "#8d05f5",
          "#e105f5",
          "#f50559",
        ];
        const randomColorIndex = Math.floor(Math.random() * colorsArr.length);
        return colorsArr[randomColorIndex];
      };

      let existingChat = await GroupChats.findOne({
        where: { senderID, groupID },
        order: [["createdAt", "ASC"]],
      });

      let nameColor;

      if (existingChat) {
        nameColor = existingChat.nameColor;
      } else {
        nameColor = getRandomDarkColor();
      }

      const groupChat = await GroupChats.create({
        senderID,
        groupID,
        message,
        senderName,
        nameColor,
      });

      if (groupChat) {
        io.to(roomID).emit("receive_group_message", groupChat);
      }
    } catch (err) {
      console.error("Error sending group message:", err);
    }
  });
};
