// models/Availability.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Availability = sequelize.define('Availability', {
  availability_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  availability_date: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'availability',
  timestamps: false, // Disable createdAt and updatedAt fields if not needed
});

module.exports = Availability;
