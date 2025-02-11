const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudentCourse = sequelize.define('StudentCourse', {
  student_course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'student_course',
  timestamps: false,
});

module.exports = StudentCourse;
