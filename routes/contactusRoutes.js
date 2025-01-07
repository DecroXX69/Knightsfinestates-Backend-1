const express = require('express');
const router = express.Router();
const contactusController = require('../controllers/contactusController');

// Contact us routes
router.post('/contactus', contactusController.createContactus);
router.get('/contactus/:id', contactusController.getAllContactus);
router.get('/contactus/:id', contactusController.getContactusById);
router.delete('/contactus/:id', contactusController.deleteContactus);


module.exports = router;