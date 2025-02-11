// routes/skillRoutes.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

// GET all skills
router.get('/skills', skillController.getAllSkills);

// GET a single skill by ID
router.get('/skills/:id', skillController.getSkillById);

// POST a new skill
router.post('/skills', skillController.createSkill);

// PUT (update) a skill by ID
router.put('/skills/:id', skillController.updateSkill);

// DELETE a skill by ID
router.delete('/skills/:id', skillController.deleteSkill);

module.exports = router;
