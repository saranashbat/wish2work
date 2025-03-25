const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const StudentRating = sequelize.define('StudentRating', {
  rating_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true, // Auto-increment for rating_id
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE, // Use DATE instead of DATETIMEOFFSET for compatibility
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true, // feedback is nullable
  },
}, {
  tableName: 'student_rating',
  timestamps: false, // Since 'created_at' is manually handled, we disable timestamps
});

module.exports = StudentRating;
