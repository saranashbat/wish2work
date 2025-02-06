const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Assuming you have a `database.js` file for DB connection

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  program_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  personal_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  average_rating: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  activated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
}, {
  tableName: 'student',
  timestamps: true, // Timestamps will be automatically handled by Sequelize
  createdAt: 'created_at', // Map Sequelize's createdAt to the custom created_at column
  updatedAt: 'updated_at'  // Map Sequelize's updatedAt to the custom updated_at column
});

sequelize.sync({ alter: true }).then(() => {
  console.log('Table altered successfully!');
}).catch((error) => {
  console.error('Error altering table:', error);
});


module.exports = Student;
