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
}, { timestamps: true });

module.exports = mongoose.model('HeroSlideshowConfig', heroSlideshowConfigSchema);