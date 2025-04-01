// models/HeroSlideshowConfig.js
const mongoose = require('mongoose');

const heroSlideshowConfigSchema = new mongoose.Schema({
    identifier: { // To easily find the single config document
        type: String,
        default: 'main_slideshow',
        unique: true,
        required: true,
    },
    imageUrls: {
        type: [String], // Array of S3 URLs
        default: [],
    },
    // --- Add this field ---
    showSearchBox: {
        type: Boolean,
        default: false, // Default to not showing the search box
    },
    // ----------------------
}, { timestamps: true });

// Ensure the identifier is indexed for quick lookups
heroSlideshowConfigSchema.index({ identifier: 1 });

module.exports = mongoose.model('HeroSlideshowConfig', heroSlideshowConfigSchema);