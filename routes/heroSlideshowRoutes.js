// routes/heroSlideshowRoutes.js
const express = require('express');
const router = express.Router();
const heroSlideshowController = require('../controllers/heroSlideshowController');
const authMiddleware = require('../middleware/auth'); // Your authentication middleware

// --- Public Route ---
// GET the slideshow config (images + settings) - No auth needed for frontend display
router.get('/hero-slideshow', heroSlideshowController.getSlideshowConfig);
// --------------------


// --- Protected Routes (Require Authentication) ---
// POST a new image
router.post('/hero-slideshow/add', authMiddleware, heroSlideshowController.addImage);

// PUT to reorder images
router.put('/hero-slideshow/reorder', authMiddleware, heroSlideshowController.reorderImages);

// DELETE an image
router.delete('/hero-slideshow/delete', authMiddleware, heroSlideshowController.deleteImage);

// PUT to update settings like showSearchBox
router.put('/hero-slideshow/settings', authMiddleware, heroSlideshowController.updateSlideshowSettings);
// -------------------------------------------------

module.exports = router;