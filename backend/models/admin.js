const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudentRating = sequelize.define('StudentRating', {
  rating_id: {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  feedback: {
    type: DataTypes.STRING(255),
    allowNull: true, // Feedback is optional
  },
}, {
  tableName: 'student_rating',
  timestamps: true, // Assuming you want to track createdAt and updatedAt
});

module.exports = StudentRating;
