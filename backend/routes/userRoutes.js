const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/userController');

console.log('Register:', typeof registerUser);
console.log('Login:', typeof loginUser);

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
