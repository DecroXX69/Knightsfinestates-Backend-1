// routes/heroSlideshowRoutes.js
const express = require('express');
const router = express.Router();
const heroSlideshowController = require('../controllers/heroSlideshowController');
const authMiddleware = require('../middleware/auth'); // Your authentication middleware

// Protect all slideshow routes
router.use('/hero-slideshow', authMiddleware);

router.get('/hero-slideshow', heroSlideshowController.getSlideshowImages);
router.post('/hero-slideshow/add', heroSlideshowController.addImage);
// Use PUT for reordering as it replaces the entire resource representation
router.put('/hero-slideshow/reorder', heroSlideshowController.reorderImages);
// Use DELETE method, but pass data in body (or use query/params if preferred)
router.delete('/hero-slideshow/delete', heroSlideshowController.deleteImage);

module.exports = router;