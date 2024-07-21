const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./users");
const Group = require("./group");

const GroupMember = sequelize.define(
  "groupmember",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userID: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = GroupMember;
