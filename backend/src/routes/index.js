const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const propertyRoutes = require('./propertyRoutes');
const tenancyRoutes = require('./tenancyRoutes');
const transactionRoutes = require('./transactionRoutes');
const issueRoutes = require('./issueRoutes');
const transactionController = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/authMiddleware');

const prisma = require('../config/db');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RoomHaiji API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

router.get('/health/db', async (req, res) => {
  const result = await prisma.checkDbConnection();
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Database connection is active and healthy'
    });
  }
  return res.status(500).json({
    success: false,
    message: 'Database connection failed',
    error: result.error
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/', tenancyRoutes);
router.use('/transactions', transactionRoutes);
router.use('/issues', issueRoutes);
router.get('/receipts/:transactionId', authenticate, transactionController.getReceipt);

module.exports = router;
