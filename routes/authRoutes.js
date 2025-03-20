const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Auth routes
router.post('/login', authController.login);
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authController.logout);

// Verify route - for checking authentication status
router.get('/auth/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    },
    expiresIn: 3600 // 1 hour in seconds
  });
});

module.exports = router;