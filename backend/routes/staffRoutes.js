const express = require('express');
const router = express.Router();

const { addStaff, getStaff } = require('../controllers/staffController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Add Staff - Admin Only
router.post('/add', authMiddleware, adminMiddleware, addStaff);

// Get All Staff - Admin Only
router.get('/', authMiddleware, adminMiddleware, getStaff);

module.exports = router;
