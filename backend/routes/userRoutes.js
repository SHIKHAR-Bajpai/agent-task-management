const express = require('express');
const { loginUser , registerUser } = require('../controllers/userController');
const router = express.Router();

// Routes for user(admin) registration and login 
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
