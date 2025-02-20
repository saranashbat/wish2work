
const Department = require('../models/department');
const ProgramOfStudy = require('../models/programOfStudy'); // Import Program Model


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

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getProgramsByDepartmentId
};
