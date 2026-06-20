const express = require('express');
const { register, login, getProfile, getAdminStats } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes with rate limit
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Private/Protected routes
router.get('/profile', protect, getProfile);
router.get('/stats', protect, restrictTo('ADMIN'), getAdminStats);

module.exports = router;
