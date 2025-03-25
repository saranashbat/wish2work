const express = require('express');
const router = express.Router();
const studentRatingController = require('../controllers/studentRatingController');

// Route to create a new student rating
router.post('/student-rating', studentRatingController.createStudentRating);

// Route to get all ratings for a specific student
router.get('/student-rating/:student_id', studentRatingController.getStudentRatings);

// Route to get all ratings given by a specific staff member
router.get('/student-rating/staff/:staff_id', studentRatingController.getStaffRatings);

// Route to get a specific rating by its ID
router.get('/student-rating/:rating_id', studentRatingController.getRatingById);

module.exports = router;
