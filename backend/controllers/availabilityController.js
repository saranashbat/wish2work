// controllers/availabilityController.js
const Availability = require('../models/availability');

exports.getAllAvailability = async (req, res) => {
  try {
    const availability = await Availability.findAll();
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailabilityById = async (req, res) => {
  try {
    const availability = await Availability.findByPk(req.params.id);
    if (availability) {
      res.status(200).json(availability);
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAvailability = async (req, res) => {
  try {
    const newAvailability = await Availability.create(req.body);
    res.status(201).json(newAvailability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const [updated] = await Availability.update(req.body, {
      where: { availability_id: req.params.id }
    });

    if (updated) {
      res.status(200).json({ message: 'Availability updated successfully' });
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const deleted = await Availability.destroy({
      where: { availability_id: req.params.id }
    });

    if (deleted) {
      res.status(200).json({ message: 'Availability deleted successfully' });
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
