// routes/programRoutes.js
const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');


// GET all programs
router.get('/programs', programController.getAllPrograms);

// GET a single program by ID
router.get('/programs/:id', programController.getProgramById);


// POST a new program
router.post('/programs', programController.createProgram);

// PUT (update) an existing program
router.put('/programs/:id', programController.updateProgram);

// DELETE a program
router.delete('/programs/:id', programController.deleteProgram);

module.exports = router;
