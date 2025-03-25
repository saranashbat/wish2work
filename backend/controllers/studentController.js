// controllers/studentController.js
const Student = require('../models/student');
const  Availability = require('../models/availability');  // Import the Availability model
const StudentCourse = require('../models/studentCourse'); // Import the StudentCourse model
const Course = require('../models/course'); // Import the Course model
const Skill = require('../models/skill'); // Import the Course model
const Request = require('../models/request');



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


// Get all courses for a specific student
exports.getCoursesForStudent = async (req, res) => {
  const { id } = req.params; // Get student_id from request params

  try {
    // Step 1: Get all the course IDs that this student is enrolled in from the StudentCourse table
    const studentCourses = await StudentCourse.findAll({
      where: { student_id: id }, // Filter by student_id
      attributes: ['course_id'], // Get only course_id
    });

    // Step 2: Extract the course IDs from the studentCourses
    const courseIds = studentCourses.map(sc => sc.course_id);

    if (courseIds.length > 0) {
      // Step 3: Fetch the courses corresponding to the course IDs
      const courses = await Course.findAll({
        where: {
          course_id: courseIds, // Use the list of course IDs to find the courses
        },
      });

      res.status(200).json(courses);
    } else {
      res.status(404).json({ message: 'No courses found for this student' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all skills for a specific student
exports.getSkillsForStudent = async (req, res) => {
  const { id } = req.params; // Get student_id from request params

  try {
    // Find all skills associated with the given student_id
    const skills = await Skill.findAll({
      where: {
        student_id: id,
      },
    });

    // Check if skills exist for the student
    if (skills.length > 0) {
      res.status(200).json(skills); // Return the skills data
    } else {
      res.status(404).json({ message: 'No skills found for this student' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getRequestsForStudent = async (req, res) => {
  const { id } = req.params; // Get student_id from the request params

  try {
    // Fetch all requests associated with the student using the student_id
    const requests = await Request.findAll({
      where: {
        student_id: id, // Filter requests by student_id
      },
      include: [
        {
          model: Student, // Optionally include Student details in the request
          attributes: ['first_name', 'last_name', 'email'], // Customize the fields if necessary
        },
      ],
    });

    // Check if requests exist for the student
    if (requests.length > 0) {
      res.status(200).json(requests); // Return the requests data
    } else {
      res.status(404).json({ message: 'No requests found for this student' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};