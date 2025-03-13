// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Property routes
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getPropertyById);
router.get('/sale/:id', propertyController.getSalePropertyById);
router.get('/offplan/:id', propertyController.getOffplanPropertyById);
router.post('/properties', propertyController.createProperty);
// routes/propertyRoutes.js
router.get('/all', propertyController.getAllProperties);
router.put('/approve/:id', propertyController.approveProperty);
router.put('/reject/:id', propertyController.rejectProperty);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);
router.get('/pending', propertyController.getPendingProperties);
router.patch('/:id/view', propertyController.incrementViewCount);
router.get('/view-count', propertyController.getPropertiesWithViewCount);
router.put('/:id/sub-status', propertyController.updateSubStatus);
module.exports = router;