const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // Ensures no duplicate emails
  },
  phone_number: {
    type: DataTypes.INTEGER,
    allowNull: true, // Optional field
  },
}, {
  tableName: 'admin', // Ensures the table is named 'admin'
  timestamps: false, // Tracks createdAt and updatedAt
});

module.exports = Admin;
