// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/auth');

// Property routes
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getPropertyById);
router.get('/sale/:id', propertyController.getSalePropertyById);
router.get('/offplan/:id', propertyController.getOffplanPropertyById);
router.get('/all', propertyController.getAllProperties);
router.get('/pending', propertyController.getPendingProperties);
router.patch('/:id/view', propertyController.incrementViewCount);
router.get('/view-count', propertyController.getPropertiesWithViewCount);

// Protected admin routes with authentication middleware
router.put('/approve/:id', authMiddleware, propertyController.approveProperty);
router.post('/properties', authMiddleware, propertyController.createProperty);
router.put('/reject/:id', authMiddleware, propertyController.rejectProperty);
router.put('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);
router.patch('/:id/sub-status', authMiddleware, propertyController.updateSubStatus);
router.patch('/:id/trend', authMiddleware, propertyController.updateTrend);
module.exports = router;