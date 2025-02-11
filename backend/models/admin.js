const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false, // Custom ID
    autoIncrement: true,

  },
  first_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'admin',
  timestamps: false,
});

module.exports = Admin;
