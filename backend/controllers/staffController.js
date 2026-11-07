const User = require('../models/User');
const bcrypt = require('bcrypt');

const addStaff = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingStaff = await User.findOne({ email });

    if (existingStaff) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'staff',
    });

    res.status(201).json({
      message: 'Staff added successfully',
      staff: {
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password');

    res.status(200).json({
      staff,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addStaff,
  getStaff,
};
