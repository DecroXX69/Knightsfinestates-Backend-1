// routes/s3Routes.js
const express = require('express');
const { getPresignedUrl } = require('../controllers/s3Controller');
// Add authentication middleware if needed: const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication if only logged-in users can upload
// router.post('/presigned-url', protect, getPresignedUrl);
router.post('/presigned-url', getPresignedUrl); // Or without auth for simplicity here

module.exports = router;