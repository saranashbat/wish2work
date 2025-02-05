const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/db'); // Import the Sequelize instance

const ProgramOfStudy = sequelize.define('ProgramOfStudy', {
  // Define columns based on your table structure
  program_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  // Optional model options
  tableName: 'program_of_study', // Explicit table name
  timestamps: false, // If you don't want timestamps in the table
});

module.exports = ProgramOfStudy;
