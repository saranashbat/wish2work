// controllers/skillController.js
const Skill = require('../models/skill');

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get skill by ID
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (skill) {
      res.status(200).json(skill);
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new skill
exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a skill
exports.updateSkill = async (req, res) => {
  try {
    const [updated] = await Skill.update(req.body, { where: { skill_id: req.params.id } });
    if (updated) {
      res.status(200).json({ message: 'Skill updated successfully' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const deleted = await Skill.destroy({ where: { skill_id: req.params.id } });
    if (deleted) {
      res.status(200).json({ message: 'Skill deleted successfully' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
