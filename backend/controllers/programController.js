// controllers/programController.js
const ProgramOfStudy = require('../models/programOfStudy');

// GET: Get all programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await ProgramOfStudy.findAll();
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Error fetching programs' });
  }
};

// GET: Get a single program by ID
const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await ProgramOfStudy.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Error fetching program' });
  }
};

// POST: Create a new program
const createProgram = async (req, res) => {
  try {
    const { name, details, department_id } = req.body;
    const program = await ProgramOfStudy.create({
      name,
      details,
      department_id
    });
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Error creating program' });
  }
};

// PUT: Update a program
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, details, department_id } = req.body;

    const program = await ProgramOfStudy.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    program.name = name || program.name;
    program.details = details || program.details;
    program.department_id = department_id || program.department_id;

    await program.save(); // Save the changes to the DB
    res.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Error updating program' });
  }
};

// DELETE: Delete a program
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await ProgramOfStudy.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    await program.destroy(); // Delete the program from the DB
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Error deleting program' });
  }
};

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
};
