const express = require('express');
const router = express.Router();

const { getRentalReports } = require('../controllers/reportController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, adminMiddleware, getRentalReports);

module.exports = router;
