// controllers/availabilityController.js
const Availability = require('../models/availability');

// Get all availability entries
exports.getAllAvailability = async (req, res) => {
  try {
    const availability = await Availability.findAll();
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get availability by specific ID
exports.getAvailabilityById = async (req, res) => {
  try {
    const availability = await Availability.findByPk(req.params.id);
    if (availability) {
      res.status(200).json(availability);
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new availability entry
exports.createAvailability = async (req, res) => {
  try {
    // Ensure start_time and end_time are valid
    const { student_id, availability_date, start_time, end_time } = req.body;

    // Validate if the times are provided and correct
    if (!start_time || !end_time || !availability_date || !student_id) {
      return res.status(400).json({ error: 'Missing required fields: start_time, end_time, availability_date, or student_id' });
    }

    const newAvailability = await Availability.create({
      student_id,
      availability_date,
      start_time,
      end_time
    });

    res.status(201).json(newAvailability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing availability entry
exports.updateAvailability = async (req, res) => {
  try {
    const { start_time, end_time, availability_date, student_id } = req.body;

    // Ensure valid data
    if (!start_time || !end_time || !availability_date || !student_id) {
      return res.status(400).json({ error: 'Missing required fields: start_time, end_time, availability_date, or student_id' });
    }

    const [updated] = await Availability.update(req.body, {
      where: { availability_id: req.params.id }
    });

    if (updated) {
      res.status(200).json({ message: 'Availability updated successfully' });
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an availability entry
exports.deleteAvailability = async (req, res) => {
  try {
    const deleted = await Availability.destroy({
      where: { availability_id: req.params.id }
    });

    if (deleted) {
      res.status(200).json({ message: 'Availability deleted successfully' });
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
