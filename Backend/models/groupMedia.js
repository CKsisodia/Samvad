const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./users");
const Group = require("./group");

const GroupMedia = sequelize.define(
  "groupmedia",
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
    groupID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Group,
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

Group.hasMany(GroupMedia, { foreignKey: "senderID" });
GroupMedia.belongsTo(Group, { foreignKey: "senderID", as: "Sender" });

Group.hasMany(GroupMedia, { foreignKey: "groupID" });
GroupMedia.belongsTo(Group, { foreignKey: "groupID", as: "Group" });

module.exports = GroupMedia;
