const { Sequelize } = require('sequelize');
require('dotenv').config();  // To load the .env file variables

// Set up Sequelize connection to the database
const sequelize = new Sequelize({
  host: process.env.DB_SERVER,     // Database server (Azure SQL Server)
  dialect: 'mssql',               // SQL Server dialect
  username: process.env.DB_USER,  // Your DB username
  password: process.env.DB_PASSWORD,  // Your DB password
  database: process.env.DB_NAME,  // Your database name
  port: process.env.DB_PORT,      // Default SQL Server port (1433)
  dialectOptions: {
    options: {
      encrypt: true,               // Encrypt the connection (for Azure)
      trustServerCertificate: true // Trust the server certificate (for Azure)
    }
  }
});

// Function to connect to DB
const connectToDB = async () => {
  try {
    await sequelize.authenticate();  // Try to authenticate with the database
    console.log('Database connected!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
};

// Export the sequelize instance and the connect function
module.exports = { sequelize, connectToDB };
