// controllers/heroSlideshowController.js
const HeroSlideshowConfig = require('../models/HeroSlideshowConfig');
const { deleteS3Object } = require('../utils/s3DeleteHelper'); // Adjust path if needed

// Helper remains the same, ensures config exists with defaults
const getConfig = async () => {
    let config = await HeroSlideshowConfig.findOne({ identifier: 'main_slideshow' });
    if (!config) {
        // Create with defaults (including showSearchBox: false from schema)
        config = await HeroSlideshowConfig.create({ identifier: 'main_slideshow', imageUrls: [] });
    }
    return config;
};

// Renamed and modified to return full config
exports.getSlideshowConfig = async (req, res) => {
    try {
        const config = await getConfig();
        // Return both images and the setting
        res.json({
            images: config.imageUrls || [],
            showSearchBox: config.showSearchBox || false
        });
    } catch (error) {
        console.error("Error fetching slideshow config:", error);
        res.status(500).json({ message: "Error fetching slideshow configuration" });
    }
};

// addImage remains mostly the same, but returns full config for consistency if desired
exports.addImage = async (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
    }
    try {
        const config = await getConfig();
        if (!config.imageUrls.includes(imageUrl)) {
            config.imageUrls.push(imageUrl);
            await config.save();
        }
        // Return updated full config
        res.status(201).json({
            images: config.imageUrls,
            showSearchBox: config.showSearchBox
        });
    } catch (error) {
        console.error("Error adding slideshow image:", error);
        res.status(500).json({ message: "Error adding slideshow image" });
    }
};

// deleteImage remains mostly the same, but returns full config
exports.deleteImage = async (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required for deletion" });
    }
    try {
        const config = await getConfig();
        const initialLength = config.imageUrls.length;
        config.imageUrls = config.imageUrls.filter(url => url !== imageUrl);

        if (config.imageUrls.length < initialLength) {
            await config.save();
            deleteS3Object(imageUrl).catch(err => console.error("S3 Deletion Error (async):", err));
            // Return updated full config
            res.json({
                message: "Image deleted successfully",
                images: config.imageUrls,
                showSearchBox: config.showSearchBox
            });
        } else {
            res.status(404).json({ message: "Image not found in slideshow" });
        }
    } catch (error) {
        console.error("Error deleting slideshow image:", error);
        res.status(500).json({ message: "Error deleting slideshow image" });
    }
};

// reorderImages remains mostly the same, but returns full config
exports.reorderImages = async (req, res) => {
    const { orderedImageUrls } = req.body;
    if (!Array.isArray(orderedImageUrls)) {
        return res.status(400).json({ message: "Ordered image URLs array is required" });
    }
    try {
        const config = await getConfig();
        config.imageUrls = orderedImageUrls;
        await config.save();
        // Return updated full config
        res.json({
            message: "Image order updated successfully",
            images: config.imageUrls,
            showSearchBox: config.showSearchBox
        });
    } catch (error) {
        console.error("Error reordering slideshow images:", error);
        res.status(500).json({ message: "Error reordering slideshow images" });
    }
};

// --- New function to update settings ---
exports.updateSlideshowSettings = async (req, res) => {
    const { showSearchBox } = req.body;

    // Validate input
    if (typeof showSearchBox !== 'boolean') {
        return res.status(400).json({ message: "Invalid value for showSearchBox. Must be true or false." });
    }

    try {
        const config = await getConfig();
        config.showSearchBox = showSearchBox;
        await config.save();
        res.json({
            message: "Slideshow settings updated successfully",
            showSearchBox: config.showSearchBox
        });
    } catch (error) {
        console.error("Error updating slideshow settings:", error);
        res.status(500).json({ message: "Error updating slideshow settings" });
    }
};
// -----------------------------------------