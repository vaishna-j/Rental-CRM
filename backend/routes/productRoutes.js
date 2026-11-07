const express = require('express');
const router = express.Router();

const { addProduct, getProducts } = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Add Product - Admin Only
router.post('/add', authMiddleware, adminMiddleware, addProduct);

// Get All Products
router.get('/', getProducts);

module.exports = router;
