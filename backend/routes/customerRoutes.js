const express = require('express');
const router = express.Router();

const {
  addCustomer,
  getCustomers,
} = require('../controllers/customerController');

const authMiddleware = require('../middleware/authMiddleware');

// Add Customer - Login Required
router.post('/add', authMiddleware, addCustomer);

// Get All Customers - Login Required
router.get('/', authMiddleware, getCustomers);

module.exports = router;
