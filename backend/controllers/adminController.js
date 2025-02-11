const Admin = require('../models/admin');
const {sequelize} = require('../config/db'); // Import the Sequelize instance

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new admin with custom ID
exports.createAdmin = async (req, res) => {
    try {
      // Turn on IDENTITY_INSERT
      await sequelize.query('SET IDENTITY_INSERT admin ON');
      
      // Create the admin with the provided custom ID
      const newAdmin = await Admin.create(req.body);
  
      // Turn off IDENTITY_INSERT
      await sequelize.query('SET IDENTITY_INSERT admin OFF');
  
      res.status(201).json(newAdmin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// Update an admin
exports.updateAdmin = async (req, res) => {
  try {
    const [updated] = await Admin.update(req.body, { where: { admin_id: req.params.id } });
    if (updated) {
      const updatedAdmin = await Admin.findByPk(req.params.id);
      res.status(200).json(updatedAdmin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.destroy({ where: { admin_id: req.params.id } });
    if (deleted) {
      res.status(200).json({ message: 'Admin deleted successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
