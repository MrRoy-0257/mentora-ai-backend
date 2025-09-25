// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Example routes (you'll add real logic later)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
