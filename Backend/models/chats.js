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
        as: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

Users.hasMany(Chats, { foreignKey: "senderID" });
Chats.belongsTo(Users, { foreignKey: "senderID", as: "Sender" });

Users.hasMany(Chats, { foreignKey: "receiverID" });
Chats.belongsTo(Users, { foreignKey: "receiverID", as: "Receiver" });

module.exports = Chats;
