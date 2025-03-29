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
  const { query, rating } = req.query; // Use 'query' for searching

  if (isNaN(departmentId)) {
    return res.status(400).json({ message: "Invalid department ID" });
  }

  try {
    // Step 1: Fetch programs of study for the department
    const programs = await ProgramOfStudy.findAll({
      where: { department_id: departmentId },
    });

    let programIds = programs.map((p) => p.program_id);

    // Initialize search conditions with department restriction
    let whereConditions = { program_id: { [Op.in]: programIds } };

    // If there's a query, we need to search for it in various fields
    if (query) {
      // Search by name (first_name or last_name)
      const nameParts = query.split(" "); // Split the query by space

      let nameSearch = {};
      if (nameParts.length === 1) {
        // If only one part (e.g., "Sara")
        nameSearch = {
          [Op.or]: [
            { first_name: { [Op.like]: `%${query}%` } },
            { last_name: { [Op.like]: `%${query}%` } },
          ],
        };
      } else if (nameParts.length === 2) {
        // If two parts (e.g., "Sara Nashbat")
        const [firstName, lastName] = nameParts;
        nameSearch = {
          [Op.or]: [
            { first_name: { [Op.like]: `%${firstName}%` } },
            { last_name: { [Op.like]: `%${lastName}%` } },
          ],
        };
      }

      // Search by skill (title or description)
      const skillSearch = await Skill.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
          ],
        },
      });
      const skillStudentIds = skillSearch.map((skill) => skill.student_id);

      // Search by course name
      const courseSearch = await Course.findAll({
        where: {
          name: { [Op.like]: `%${query}%` },
        },
      });
      const courseIds = courseSearch.map((course) => course.course_id);
      const studentsInCourses = await StudentCourse.findAll({
        where: { course_id: { [Op.in]: courseIds } },
        attributes: ["student_id"],
      });
      const studentIdsFromCourses = studentsInCourses.map((sc) => sc.student_id);

      // Combine all search conditions
      if (skillStudentIds.length > 0) {
        whereConditions[Op.or] = whereConditions[Op.or]
          ? [...whereConditions[Op.or], { student_id: { [Op.in]: skillStudentIds } }]
          : [{ student_id: { [Op.in]: skillStudentIds } }];
      }

      if (studentIdsFromCourses.length > 0) {
        whereConditions[Op.or] = whereConditions[Op.or]
          ? [...whereConditions[Op.or], { student_id: { [Op.in]: studentIdsFromCourses } }]
          : [{ student_id: { [Op.in]: studentIdsFromCourses } }];
      }

      // Apply name search condition if it's provided
      whereConditions[Op.or] = whereConditions[Op.or]
        ? [...whereConditions[Op.or], nameSearch]
        : [nameSearch];
    }

    // Fetch students based on the combined search conditions
    let students = await Student.findAll({
      where: whereConditions,
    });

    // Sort by rating (high to low) if requested
    if (rating == "high") {
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
