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

module.exports = router;