const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Chats = require("./chats");
const Users = require("./users");

const ChatMedia = sequelize.define(
  "chatmedia",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    senderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
    receiverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Users.hasMany(ChatMedia, { foreignKey: "senderID" });
ChatMedia.belongsTo(Users, { foreignKey: "senderID", as: "Sender" });

Users.hasMany(ChatMedia, { foreignKey: "receiverID" });
ChatMedia.belongsTo(Users, { foreignKey: "receiverID", as: "Receiver" });


module.exports = ChatMedia;
