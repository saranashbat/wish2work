const Student = require('../models/student'); // Import the Student model

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  const {
    program_id,
    first_name,
    last_name,
    email,
    phone_number,
    personal_description,
    average_rating,
    is_active,
    activated_at,
  } = req.body;
  try {
    const newStudent = await Student.create({
      program_id,
      first_name,
      last_name,
      email,
      phone_number,
      personal_description,
      average_rating,
      is_active,
      activated_at,
    });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    program_id,
    first_name,
    last_name,
    email,
    phone_number,
    personal_description,
    average_rating,
    is_active,
    activated_at,
  } = req.body;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.program_id = program_id || student.program_id;
    student.first_name = first_name || student.first_name;
    student.last_name = last_name || student.last_name;
    student.email = email || student.email;
    student.phone_number = phone_number || student.phone_number;
    student.personal_description = personal_description || student.personal_description;
    student.average_rating = average_rating || student.average_rating;
    student.is_active = is_active || student.is_active;
    student.activated_at = activated_at || student.activated_at;
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export controller methods
module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
