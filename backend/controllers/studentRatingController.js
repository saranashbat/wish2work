const { StudentRating } = require('../models');

// Create a new student rating
const createStudentRating = async (req, res) => {
  const { student_id, staff_id, rating_value, feedback } = req.body;

  try {
    // Validate the required fields
    if (!student_id || !staff_id || !rating_value) {
      return res.status(400).json({ message: 'Student ID, Staff ID, and Rating Value are required' });
    }

    // Validate rating value (it should be between 1 and 5)
    if (rating_value < 1 || rating_value > 5) {
      return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    }

    // Create the new rating
    const newRating = await StudentRating.create({
      student_id,
      staff_id,
      rating_value,
      feedback,
      created_at: new Date(),
    });

    return res.status(201).json({
      message: 'Rating created successfully',
      rating: newRating,
    });
  } catch (error) {
    console.error('Error creating rating:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all ratings for a student
const getStudentRatings = async (req, res) => {
  const { student_id } = req.params;

  try {
    // Fetch all ratings for the student
    const ratings = await StudentRating.findAll({
      where: {
        student_id,
      },
    });

    if (ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this student' });
    }

    return res.status(200).json({ ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all ratings given by a staff member
const getStaffRatings = async (req, res) => {
  const { staff_id } = req.params;

  try {
    // Fetch all ratings given by the staff member
    const ratings = await StudentRating.findAll({
      where: {
        staff_id,
      },
    });

    if (ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings found from this staff member' });
    }

    return res.status(200).json({ ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific rating
const getRatingById = async (req, res) => {
  const { rating_id } = req.params;

  try {
    // Fetch the rating by ID
    const rating = await StudentRating.findOne({
      where: {
        rating_id,
      },
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    return res.status(200).json({ rating });
  } catch (error) {
    console.error('Error fetching rating:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createStudentRating,
  getStudentRatings,
  getStaffRatings,
  getRatingById,
};
