const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');


// Get all staff
router.get('/staff', staffController.getAllStaff); 

// Get a single staff by ID
router.get('/staff/:id', staffController.getStaffById); 

// Create new staff member
router.post('/staff', staffController.createStaff); 

// Update an existing staff member
router.put('/staff/:id', staffController.updateStaff); 

// Delete a staff member
router.delete('/staff/:id', staffController.deleteStaff); 

// Activate staff route
router.patch('/staff/:id/activate', staffController.activateStaff);

// Deactivate staff route
router.patch('/staff/:id/deactivate', staffController.deactivateStaff);

router.get('/staff/email/:email', staffController.getStaffByEmail)


module.exports = router;
