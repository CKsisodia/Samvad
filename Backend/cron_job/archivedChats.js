const ArchivedChats = require("../models/archivedChats");
const Chats = require("../models/chats");

exports.archivedChats = async () => {
  try {
    let chats;
    do {
      chats = await Chats.findAll();
      if (chats.length > 0) {
        await ArchivedChats.bulkCreate(
          chats.map((chat) => {
            const { id, ...rest } = chat.get({ plain: true });
            return rest;
          })
        );
      }
      await Chats.destroy({ truncate: true });
    } while (chats.length > 0);
  } catch (error) {
    console.log(error);
    throw new Error("archivedChat backup failed");
  }
};
