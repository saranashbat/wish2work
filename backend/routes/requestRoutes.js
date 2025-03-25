const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Get all requests
router.get('/requests', requestController.getAllRequests);

// Get a single request by ID
router.get('/requests/:id', requestController.getRequestById);

// Create a new request
router.post('/requests', requestController.createRequest);

// Update a request
router.put('/requests/:id', requestController.updateRequest);

// Delete a request
router.delete('/requests/:id', requestController.deleteRequest);

module.exports = router;
