const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./users");

const ArchivedChats = sequelize.define(
  "archivedchats",
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

Users.hasMany(ArchivedChats, { foreignKey: "senderID" });
ArchivedChats.belongsTo(Users, { foreignKey: "senderID", as: "Sender" });

Users.hasMany(ArchivedChats, { foreignKey: "receiverID" });
ArchivedChats.belongsTo(Users, { foreignKey: "receiverID", as: "Receiver" });

module.exports = ArchivedChats;
