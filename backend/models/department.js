// models/department.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db'); 

const Department = sequelize.define('Department', {
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
}, {
  timestamps: false, 
  tableName: 'department', 
});

module.exports = Department;
