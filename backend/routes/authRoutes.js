// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST api/auth/register (Untuk testing/setup awal)
router.post('/register', authController.register);

// POST api/auth/login
router.post('/login', authController.login);

module.exports = router;