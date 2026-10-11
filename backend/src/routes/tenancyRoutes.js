const express = require('express');
const router = express.Router();
const tenancyController = require('../controllers/tenancyController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.use(authenticate);

// GET /api/tenants - Landlord views all active tenants
router.get('/tenants', authorizeRoles('LANDLORD'), tenancyController.getTenants);

// POST /api/tenants/onboard - Landlord onboards a tenant
router.post('/tenants/onboard', authorizeRoles('LANDLORD'), tenancyController.onboardTenant);

// GET /api/tenancies/me - Tenant views their own lease details
router.get('/tenancies/me', authorizeRoles('TENANT'), tenancyController.getMyTenancy);

module.exports = router;

