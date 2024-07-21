const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./users");
const GroupMember = require("./groupMember");

const Group = sequelize.define(
  "group",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
    totalMembers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdBy : {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: true  }
);

Users.belongsToMany(Group, { through: GroupMember, foreignKey: "userID",onDelete: "CASCADE" });
Group.belongsToMany(Users, { through: GroupMember, foreignKey: "groupID",onDelete: "CASCADE"  });

Group.hasMany(GroupMember, { foreignKey: "groupID" ,onDelete: "CASCADE" });
GroupMember.belongsTo(Group, { foreignKey: "groupID" ,onDelete: "CASCADE" });

Users.hasMany(GroupMember, { foreignKey: "userID",onDelete: "CASCADE"  });
GroupMember.belongsTo(Users, { foreignKey: "userID",onDelete: "CASCADE"  });

module.exports = Group;
