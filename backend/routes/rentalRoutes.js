const express = require('express');
const router = express.Router();

const {
  createRental,
  getRentals,
  dispatchRental,
  returnRental,
} = require('../controllers/rentalController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createRental);

router.get('/', authMiddleware, getRentals);

router.put('/dispatch/:id', authMiddleware, dispatchRental);

router.put('/return/:id', authMiddleware, returnRental);

module.exports = router;
