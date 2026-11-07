const express = require('express');
const router = express.Router();

const { addPayment, getPayments } = require('../controllers/paymentController');

const authMiddleware = require('../middleware/authMiddleware');

// Add Payment
router.post('/add', authMiddleware, addPayment);

// Get All Payments
router.get('/', authMiddleware, getPayments);

module.exports = router;
