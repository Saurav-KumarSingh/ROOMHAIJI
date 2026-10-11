const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// All property routes require authentication
router.use(authenticate);

// GET /api/properties (Landlord properties)
router.get('/', authorizeRoles('LANDLORD'), propertyController.getProperties);

// POST /api/properties (Create property)
router.post('/', authorizeRoles('LANDLORD'), propertyController.createProperty);

// GET /api/properties/:id (Property details)
router.get('/:id', propertyController.getPropertyById);

// POST /api/properties/:id/rooms (Add room)
router.post('/:id/rooms', authorizeRoles('LANDLORD'), propertyController.addRoom);

module.exports = router;

