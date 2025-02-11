const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get all admins
router.get('/admins', adminController.getAllAdmins);

// Get a single admin by ID
router.get('/admins/:id', adminController.getAdminById);

// Create a new admin with custom ID
router.post('/admins', adminController.createAdmin);

// Update an admin
router.put('/admins/:id', adminController.updateAdmin);

// Delete an admin
router.delete('/admins/:id', adminController.deleteAdmin);

module.exports = router;
