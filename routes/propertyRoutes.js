// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Property routes
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getPropertyById);



module.exports = router;