const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./users");
const Group = require("./group");

const GroupChats = sequelize.define(
  "groupchat",
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Group.hasMany(GroupChats, { foreignKey: "senderID" });
GroupChats.belongsTo(Group, { foreignKey: "senderID", as: "Sender" });

Group.hasMany(GroupChats, { foreignKey: "groupID" });
GroupChats.belongsTo(Group, { foreignKey: "groupID", as: "Group" });

module.exports = GroupChats;
