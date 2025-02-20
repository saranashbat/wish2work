// routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Get all departments
router.get('/departments', departmentController.getDepartments);

// Get department by ID
router.get('/departments/:id', departmentController.getDepartmentById);

// Create a new department
router.post('/departments', departmentController.createDepartment);

// Update a department
router.put('/departments/:id', departmentController.updateDepartment);

// Delete a department
router.delete('/departments/:id', departmentController.deleteDepartment);

// Get programs for a specific department
router.get('/departments/:id/programs', departmentController.getProgramsByDepartmentId);

module.exports = router;
