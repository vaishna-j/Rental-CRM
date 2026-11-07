const express = require('express');
const router = express.Router();

const {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
} = require('../controllers/maintenanceController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/add', authMiddleware, adminMiddleware, addMaintenance);

router.get('/', authMiddleware, adminMiddleware, getMaintenance);

router.put('/update/:id', authMiddleware, adminMiddleware, updateMaintenance);

module.exports = router;
