const Course = require('../models/course'); // Import the Course model

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  const { name, description, department_id } = req.body;
  try {
    const newCourse = await Course.create({ name, description, department_id });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, description, department_id } = req.body;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    course.name = name || course.name;
    course.description = description || course.description;
    course.department_id = department_id || course.department_id;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export controller methods
module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
