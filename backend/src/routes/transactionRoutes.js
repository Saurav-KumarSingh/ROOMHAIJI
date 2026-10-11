const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.use(authenticate);

// GET /api/transactions
router.get('/', transactionController.getTransactions);

// POST /api/transactions/cash - Landlord records cash payment
router.post('/cash', authorizeRoles('LANDLORD'), transactionController.recordCashPayment);

// POST /api/transactions/upi/verify - Verify UPI payment
router.post('/upi/verify', transactionController.verifyUpiPayment);

// GET /api/transactions/due - Due rent for current month
router.get('/due', transactionController.getDueTransactions);

module.exports = router;

