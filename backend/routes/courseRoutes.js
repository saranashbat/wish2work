const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController'); // Import controller functions

const router = express.Router();

// Route for getting all courses
router.get('/courses', getCourses);

// Route for getting a course by ID
router.get('/courses/:id', getCourseById);

// Route for creating a new course
router.post('/courses', createCourse);

// Route for updating a course
router.put('/courses/:id', updateCourse);

// Route for deleting a course
router.delete('/courses/:id', deleteCourse);

module.exports = router;
