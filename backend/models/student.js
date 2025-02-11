const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import the Sequelize instance

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  program_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    type: DataTypes.STRING(15), // Using STRING to store phone numbers with non-numeric characters
    allowNull: false,
  },
  personal_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  average_rating: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'student',
  timestamps: false, // Disable automatic timestamp fields creation
});

module.exports = Student;
