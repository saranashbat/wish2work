// server.js
const express = require('express');
const { connectToDB } = require('./config/db');
const programRoutes = require('./routes/programRoutes'); // Import routes
const departmentRoutes = require('./routes/departmentRoutes'); // Import routes
const courseRoutes = require('./routes/courseRoutes'); // Import the course routes

const app = express();

app.use(express.json()); // Middleware to parse JSON requests

// Test the DB connection on server start
connectToDB();

// Use the program routes
app.use('/api', programRoutes); // All program routes will start with '/api'

// Use the department routes
app.use('/api', departmentRoutes);

// Use the course routes
app.use('/api', courseRoutes); 


// Default route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
