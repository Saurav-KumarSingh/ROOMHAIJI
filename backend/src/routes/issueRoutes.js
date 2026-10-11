const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.use(authenticate);

// GET /api/issues
router.get('/', issueController.getIssues);

// POST /api/issues - Tenant reports an issue
router.post('/', authorizeRoles('TENANT'), issueController.reportIssue);

// PATCH /api/issues/:id/status - Landlord updates status
router.patch('/:id/status', authorizeRoles('LANDLORD'), issueController.updateIssueStatus);

module.exports = router;

