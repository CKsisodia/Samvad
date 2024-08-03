const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./users");
const Group = require("./group");

const ArchivedGroupChats = sequelize.define(
  "archivedgroupchat",
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
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameColor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "#e534eb",
    },
    groupID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Group,
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

Group.hasMany(ArchivedGroupChats, { foreignKey: "senderID" });
ArchivedGroupChats.belongsTo(Group, { foreignKey: "senderID", as: "Sender" });

Group.hasMany(ArchivedGroupChats, { foreignKey: "groupID" });
ArchivedGroupChats.belongsTo(Group, { foreignKey: "groupID", as: "Group" });

module.exports = ArchivedGroupChats;
