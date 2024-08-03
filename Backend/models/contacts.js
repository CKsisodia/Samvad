const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const Users = require("./users");

const Contacts = sequelize.define(
  "contacts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
    contactUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

Users.hasMany(Contacts, { foreignKey: 'userID' });
Contacts.belongsTo(Users, { foreignKey: 'userID' });

Users.hasMany(Contacts, { foreignKey: 'contactUserID' });
Contacts.belongsTo(Users, { foreignKey: 'contactUserID' , as: 'contactUser' });

module.exports = Contacts;
