const Request = require('../models/request');
const { sequelize } = require('../config/db'); // Import the Sequelize instance

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (request) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new request
exports.createRequest = async (req, res) => {
  try {
    // Create the request with the provided data
    const newRequest = await Request.create(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a request
exports.updateRequest = async (req, res) => {
  try {
    const [updated] = await Request.update(req.body, { where: { request_id: req.params.id } });
    if (updated) {
      const updatedRequest = await Request.findByPk(req.params.id);
      res.status(200).json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a request
exports.deleteRequest = async (req, res) => {
  try {
    const deleted = await Request.destroy({ where: { request_id: req.params.id } });
    if (deleted) {
      res.status(200).json({ message: 'Request deleted successfully' });
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
