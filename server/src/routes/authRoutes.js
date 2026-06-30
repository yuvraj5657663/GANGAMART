const express = require('express');
const router = express.Router();

// 🔥 Path ko sahi se point karein (agar routes folder src ke andar hai, toh controller bhi src/controllers me hoga)
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

// Routes definitions
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;