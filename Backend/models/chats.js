const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./users");

const Chats = sequelize.define(
  "chats",
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
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Users.hasMany(Chats, { foreignKey: "senderID" });
Chats.belongsTo(Users, { foreignKey: "senderID", as: "Sender" });

Users.hasMany(Chats, { foreignKey: "receiverID" });
Chats.belongsTo(Users, { foreignKey: "receiverID", as: "Receiver" });

module.exports = Chats;
