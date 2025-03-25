const Staff = require('../models/staff');
const Request = require('../models/request'); // Import the Request model

const { sequelize } = require('../config/db'); // Import the Sequelize instance

// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single staff member by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (staff) {
      res.status(200).json(staff);
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new staff member
exports.createStaff = async (req, res) => {
  try {
    // Turn on IDENTITY_INSERT if needed (for custom IDs)
    await sequelize.query('SET IDENTITY_INSERT staff ON');
    
    // Create the staff member with custom ID (if applicable)
    const newStaff = await Staff.create(req.body);

    // Turn off IDENTITY_INSERT
    await sequelize.query('SET IDENTITY_INSERT staff OFF');    
    
    res.status(201).json(newStaff);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Update an existing staff member
exports.updateStaff = async (req, res) => {
  try {
    const updated = await Staff.update(req.body, {
      where: { staff_id: req.params.id }
    });
    if (updated[0]) {
      res.status(200).json({ message: 'Staff member updated successfully' });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a staff member
exports.deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.destroy({ where: { staff_id: req.params.id } });
    if (deleted) {
      res.status(200).json({ message: 'Staff member deleted successfully' });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Activate staff
exports.activateStaff = async (req, res) => {
    try {
      const [updated] = await Staff.update(
        { is_active: true }, // Set is_active to true for activation
        { where: { staff_id: req.params.id } }
      );
  
      if (updated) {
        res.status(200).json({ message: 'Staff activated successfully' });
      } else {
        res.status(404).json({ message: 'Staff not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Deactivate staff
  exports.deactivateStaff = async (req, res) => {
    try {
      const [updated] = await Staff.update(
        { is_active: false }, // Set is_active to false for deactivation
        { where: { staff_id: req.params.id } }
      );
  
      if (updated) {
        res.status(200).json({ message: 'Staff deactivated successfully' });
      } else {
        res.status(404).json({ message: 'Staff not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.getStaffByEmail = async (req, res) => {
    try {
      // Find the staff member by email
      const staff = await Staff.findOne({ where: { email: req.params.email } });
  
      if (staff) {
        res.status(200).json(staff);
      } else {
        res.status(404).json({ message: 'Staff member not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getRequestsByStaff = async (req, res) => {
    try {
      const staffId = req.params.staff_id;
  
      // Find the staff member by staff_id
      const staff = await Staff.findByPk(staffId);
  
      if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
      }
  
      // Retrieve requests that belong to the staff member by staff_id
      const requests = await Request.findAll({
        where: { staff_id: staffId },
        include: [
          {
            model: Staff,
            attributes: ['first_name', 'last_name', 'email'], // Include relevant staff attributes if needed
          },
          // Include any other related models or associations
        ],
      });
  
      if (requests.length === 0) {
        return res.status(404).json({ message: 'No requests found for this staff member' });
      }
  
      // Return the retrieved requests
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error retrieving requests:', error);
      res.status(500).json({ error: error.message });
    }
  };