const express = require('express');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController'); // Import controller functions

const router = express.Router();

// Route for getting all students
router.get('/students', getStudents);

// Route for getting a student by ID
router.get('/students/:id', getStudentById);

// Route for creating a new student
router.post('/students', createStudent);

// Route for updating a student
router.put('/students/:id', updateStudent);

// Route for deleting a student
router.delete('/students/:id', deleteStudent);

module.exports = router;
