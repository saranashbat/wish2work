// server.js
const express = require('express');
const { connectToDB } = require('./config/db');
const programRoutes = require('./routes/programRoutes'); // Import routes
const departmentRoutes = require('./routes/departmentRoutes'); // Import routes
const courseRoutes = require('./routes/courseRoutes'); // Import the course routes
const studentRoutes = require('./routes/studentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes'); // Import availability routes
const skillRoutes = require('./routes/skillRoutes');
const studentCourseRoutes = require('./routes/studentCourseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const requestRoutes = require('./routes/requestRoutes'); // Import request routes
const studentRatingRoutes = require('./routes/studentRatingRoutes');


const app = express();

app.use(express.json()); // Middleware to parse JSON requests

// Test the DB connection on server start
connectToDB();

app.use('/api', programRoutes); 
app.use('/api', departmentRoutes);
app.use('/api', courseRoutes); 
app.use('/api', studentRoutes);
app.use('/api', staffRoutes);
app.use('/api', availabilityRoutes); 
app.use('/api', skillRoutes);
app.use('/api', studentCourseRoutes);
app.use('/api', adminRoutes);
app.use('/api', requestRoutes); // Add the request routes here
app.use('/api', studentRatingRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
