// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Property routes
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getPropertyById);
router.get('/sale/:id', propertyController.getSalePropertyById);
router.get('/offplan/:id', propertyController.getOffplanPropertyById);


module.exports = router;