const ArchivedGroupChats = require("../models/archivedGroupChats");
const GroupChats = require("../models/groupChats");

exports.archivedGroupChats = async () => {
  try {
    let chats;
    do {
      chats = await GroupChats.findAll();
      if (chats.length > 0) {
        await ArchivedGroupChats.bulkCreate(
          chats.map((chat) => chat.get({ plain: true }))
        );
      }
      await GroupChats.destroy({ truncate: true });
    } while (chats.length > 0);
  } catch (error) {
    console.log(error);
    throw new Error("archivedGroupChat backup failed");
  }
};
