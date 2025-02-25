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
    type: DataTypes.DATEONLY, // stores only the date, without time
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME, // stores only the time part
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME, // stores only the time part
    allowNull: false,
  }
}, {
  tableName: 'availability',
  timestamps: false, // Disable createdAt and updatedAt fields if not needed
});

module.exports = Availability;
