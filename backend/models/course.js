const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db'); // Import the Sequelize instance

// Define the 'Course' model
const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true, // Add auto increment for primary key
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
    {
        timestamps: false, 
        tableName: 'course', 
    }

);

// Export the model
module.exports = Course;
