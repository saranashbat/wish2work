// routes/availabilityRoutes.js
const express = require('express');
const {
  getAllAvailability,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} = require('../controllers/availabilityController');

const router = express.Router();

router.get('/availability', getAllAvailability); // GET all availability records
router.get('/availability/:id', getAvailabilityById); // GET a specific availability record by ID
router.post('/availability', createAvailability); // CREATE a new availability record
router.put('/availability/:id', updateAvailability); // UPDATE an availability record by ID
router.delete('/availability/:id', deleteAvailability); // DELETE an availability record by ID

module.exports = router;
