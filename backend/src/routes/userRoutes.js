const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

// Protected User routes
router.use(authenticate);

// GET /api/users/me
router.get('/me', userController.getMe);

// PUT /api/users/me
router.put('/me', userController.updateMe);

module.exports = router;

