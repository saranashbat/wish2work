const Department = require('../models/department');
const ProgramOfStudy = require('../models/programOfStudy'); // Import Program Model
const Student = require('../models/student'); // Import Student Model
const Skill = require('../models/skill');
const Course = require('../models/course');
const StudentCourse = require('../models/studentCourse');
const { Op } = require('sequelize'); // Ensure this is imported



// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (department) {
      res.json(department);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, details, abbrev } = req.body;
    const department = await Department.create({ name, details, abbrev });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a department
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (department) {
      const { name, details, abbrev } = req.body;
      await department.update({ name, details, abbrev });
      res.json(department);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (department) {
      await department.destroy();
      res.json({ message: 'Department deleted' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get programs by department ID
const getProgramsByDepartmentId = async (req, res) => {
  const departmentId = parseInt(req.params.id, 10); // Convert to number

  if (isNaN(departmentId)) {
    return res.status(400).json({ message: 'Invalid department ID' });
  }

  try {
    const programs = await ProgramOfStudy.findAll({
      where: { department_id: departmentId }
    });

    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students in a department
const getStudentsByDepartmentId = async (req, res) => {
  const departmentId = parseInt(req.params.id, 10); // Convert to number

  if (isNaN(departmentId)) {
    return res.status(400).json({ message: 'Invalid department ID' });
  }

  try {
    const programs = await ProgramOfStudy.findAll({
      where: { department_id: departmentId }
    });

    const programIds = programs.map(program => program.program_id);

    const students = await Student.findAll({
      where: { program_id: programIds }
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchStudentsByDepartment = async (req, res) => {
  const departmentId = parseInt(req.params.id, 10); // Convert to number
  const { name, skill, course, program, rating } = req.query; // Changed program_id → program (name)

  if (isNaN(departmentId)) {
    return res.status(400).json({ message: "Invalid department ID" });
  }

  try {
    // Step 1: Fetch programs of study for the department
    const programs = await ProgramOfStudy.findAll({
      where: { department_id: departmentId },
    });

    let programIds = programs.map((p) => p.program_id);

    // Search by program name
    if (program) {
      const matchingPrograms = await ProgramOfStudy.findAll({
        where: { name: { [Op.like]: `%${program}%` }, department_id: departmentId }, // Ensure it's within the department
      });

      programIds = matchingPrograms.map((p) => p.program_id);
    }

    // Initialize search conditions with department restriction
    let whereConditions = { program_id: { [Op.in]: programIds } };

    // Search by name (first_name or last_name) within the department
    if (name) {
      whereConditions[Op.or] = [
        { first_name: { [Op.like]: `%${name}%` } },
        { last_name: { [Op.like]: `%${name}%` } },
      ];
    }

    // Search by skill within the department
    if (skill) {
      const studentsWithSkills = await Skill.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${skill}%` } },
            { description: { [Op.like]: `%${skill}%` } },
          ],
        },
      });

      const studentIds = studentsWithSkills.map((skill) => skill.student_id);

      if (studentIds.length > 0) {
        whereConditions.student_id = whereConditions.student_id
          ? { [Op.and]: [whereConditions.student_id, { [Op.in]: studentIds }] }
          : { [Op.in]: studentIds };
      } else {
        whereConditions.student_id = [];
      }
    }

    // Search by course within the department
    if (course) {
      const coursesWithName = await Course.findAll({
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${course}%` } }],
        },
      });

      const courseIds = coursesWithName.map((course) => course.course_id);

      const studentsInCourses = await StudentCourse.findAll({
        where: { course_id: { [Op.in]: courseIds } },
        attributes: ["student_id"],
      });

      const studentIdsFromCourses = studentsInCourses.map((sc) => sc.student_id);

      if (studentIdsFromCourses.length > 0) {
        whereConditions.student_id = whereConditions.student_id
          ? { [Op.and]: [whereConditions.student_id, { [Op.in]: studentIdsFromCourses }] }
          : { [Op.in]: studentIdsFromCourses };
      } else {
        whereConditions.student_id = [];
      }
    }

    // Fetch students within the department
    let students = await Student.findAll({
      where: whereConditions,
    });

    // Sort by rating (high to low) if requested
    if (rating === "high") {
      students = students.sort((a, b) => b.rating - a.rating);
    }

    if (students.length > 0) {
      res.status(200).json(students);
    } else {
      res.status(404).json({ message: "No students found with the given criteria" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getProgramsByDepartmentId,
  getStudentsByDepartmentId,
  searchStudentsByDepartment
};
