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
const axios = require('axios'); // Import axios to make HTTP requests

const app = express();

app.use(express.json()); // Middleware to parse JSON requests

// Test the DB connection on server start
connectToDB();

// Existing routes
app.use('/api', programRoutes); 
app.use('/api', departmentRoutes);
app.use('/api', courseRoutes); 
app.use('/api', studentRoutes);
app.use('/api', staffRoutes);
app.use('/api', availabilityRoutes); 
app.use('/api', skillRoutes);
app.use('/api', studentCourseRoutes);
app.use('/api', adminRoutes);

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_98w6a3l';
const EMAILJS_TEMPLATE_ID = 'template_13el4oq';
const EMAILJS_USER_ID = 'mLYs7Ou1PllDr_Xpm';

// Route to handle email sending
app.post('/send-email', async (req, res) => {
  const { recipient, subject, message } = req.body;

  if (!recipient || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const templateParams = {
    to_email: recipient,
    subject: subject,
    message: message,
  };

  try {
    // Send email via EmailJS
    const response = await axios.post(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: templateParams,
      }
    );

    // Check if the email was sent successfully
    if (response.status === 200) {
      res.status(200).json({ message: 'Email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
