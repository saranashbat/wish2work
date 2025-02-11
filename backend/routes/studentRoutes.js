// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Get all students
router.get('/students', studentController.getAllStudents);

// Get a specific student by ID
router.get('/students/:id', studentController.getStudentById);

// Create a new student
router.post('/students', studentController.createStudent);

// Update an existing student by ID
router.put('/students/:id', studentController.updateStudent);

// Delete a student by ID
router.delete('/students/:id', studentController.deleteStudent);

module.exports = router;
