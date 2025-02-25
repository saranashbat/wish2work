// controllers/studentController.js
const Student = require('../models/student');
const  Availability = require('../models/availability');  // Import the Availability model

const {sequelize} = require('../config/db'); // Import the Sequelize instance


// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    // Turn on IDENTITY_INSERT
    await sequelize.query('SET IDENTITY_INSERT student ON');
        
    // Create the student with custom ID
    const newStudent = await Student.create(req.body);

    // Turn off IDENTITY_INSERT
    await sequelize.query('SET IDENTITY_INSERT student OFF');    
    
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing student
exports.updateStudent = async (req, res) => {
  try {
    const updated = await Student.update(req.body, { where: { student_id: req.params.id } });
    if (updated[0]) {
      res.status(200).json({ message: 'Student updated successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.destroy({ where: { student_id: req.params.id } });
    if (deleted) {
      res.status(200).json({ message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activate student
exports.activateStudent = async (req, res) => {
  try {
    const [updated] = await Student.update(
      { is_active: true }, // Set is_active to true for activation
      { where: { student_id: req.params.id } }
    );

    if (updated) {
      res.status(200).json({ message: 'Student activated successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deactivate student
exports.deactivateStudent = async (req, res) => {
  try {
    const [updated] = await Student.update(
      { is_active: false }, // Set is_active to false for deactivation
      { where: { student_id: req.params.id } }
    );

    if (updated) {
      res.status(200).json({ message: 'Student deactivated successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAvailabilityForStudent = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch all availability for the given studentId
    console.log(Availability);  // Check if the model is properly imported
    
    const availabilities = await Availability.findAll({
      where: {
        student_id: id,
      },
    });

    // Check if availabilities exist for the student
    if (availabilities.length > 0) {
      res.status(200).json(availabilities);  // Return the availability data
    } else {
      res.status(404).json({ message: 'No availability found for this student' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
