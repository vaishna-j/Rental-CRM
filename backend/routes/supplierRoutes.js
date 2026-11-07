const express = require('express');
const router = express.Router();

const {
  addSupplier,
  getSuppliers,
} = require('../controllers/supplierController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/add', authMiddleware, adminMiddleware, addSupplier);

router.get('/', authMiddleware, adminMiddleware, getSuppliers);

module.exports = router;
