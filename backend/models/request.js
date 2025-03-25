const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import the Sequelize instance

const Request = sequelize.define('Request', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME, // Use DATE for handling DateTimeOFFSET data
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME, // Use DATE for handling DateTimeOFFSET data
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  availability_date: {
    type: DataTypes.DATEONLY, // Use DATEONLY for handling the availability date as a DATE type
    allowNull: false,
  }
}, {
  tableName: 'request',
  timestamps: false, // Disable automatic timestamp fields creation
});

module.exports = Request;
