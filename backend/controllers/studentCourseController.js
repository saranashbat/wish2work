const StudentCourse = require('../models/studentCourse');

// Get all student-course records
exports.getAllStudentCourses = async (req, res) => {
  try {
    const studentCourses = await StudentCourse.findAll();
    res.status(200).json(studentCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single student-course record by ID
exports.getStudentCourseById = async (req, res) => {
  try {
    const studentCourse = await StudentCourse.findByPk(req.params.id);
    if (studentCourse) {
      res.status(200).json(studentCourse);
    } else {
      res.status(404).json({ message: 'StudentCourse not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new student-course record
exports.createStudentCourse = async (req, res) => {
  try {
    const studentCourse = await StudentCourse.create(req.body);
    res.status(201).json(studentCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a student-course record
exports.updateStudentCourse = async (req, res) => {
  try {
    const [updated] = await StudentCourse.update(req.body, { where: { student_course_id: req.params.id } });
    if (updated) {
      const updatedStudentCourse = await StudentCourse.findByPk(req.params.id);
      res.status(200).json(updatedStudentCourse);
    } else {
      res.status(404).json({ message: 'StudentCourse not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a student-course record
exports.deleteStudentCourse = async (req, res) => {
  try {
    const deleted = await StudentCourse.destroy({ where: { student_course_id: req.params.id } });
    if (deleted) {
      res.status(200).json({ message: 'StudentCourse deleted successfully' });
    } else {
      res.status(404).json({ message: 'StudentCourse not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
