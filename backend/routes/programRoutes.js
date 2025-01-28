// routes/programRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} = require('../controllers/programController');

// GET all programs
router.get('/programs', getAllPrograms);

// GET a single program by ID
router.get('/programs/:id', getProgramById);

// POST a new program
router.post('/programs', createProgram);

// PUT (update) an existing program
router.put('/programs/:id', updateProgram);

// DELETE a program
router.delete('/programs/:id', deleteProgram);

module.exports = router;
