const express = require('express');
const router = express.Router();
const studentCourseController = require('../controllers/studentCourseController');

// Get all student-course records
router.get('/student-courses', studentCourseController.getAllStudentCourses);

// Get a single student-course record by ID
router.get('/student-courses/:id', studentCourseController.getStudentCourseById);

// Create a new student-course record
router.post('/student-courses', studentCourseController.createStudentCourse);

// Update a student-course record
router.put('/student-courses/:id', studentCourseController.updateStudentCourse);

// Delete a student-course record
router.delete('/student-courses/:course_id/:student_id', studentCourseController.deleteStudentCourse);

module.exports = router;
