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

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RoomHaiji API is running smoothly',
    timestamp: new Date().toISOString()
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
