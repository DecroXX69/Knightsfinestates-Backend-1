// controllers/heroSlideshowController.js
const HeroSlideshowConfig = require('../models/HeroSlideshowConfig');
const { deleteS3Object } = require('../utils/s3DeleteHelper'); // Adjust path if needed

const getConfig = async () => {
    let config = await HeroSlideshowConfig.findOne({ identifier: 'main_slideshow' });
    if (!config) {
        config = await HeroSlideshowConfig.create({ identifier: 'main_slideshow', imageUrls: [] });
    }
    return config;
};

exports.getSlideshowImages = async (req, res) => {
    try {
        const config = await getConfig();
        res.json(config.imageUrls);
    } catch (error) {
        console.error("Error fetching slideshow images:", error);
        res.status(500).json({ message: "Error fetching slideshow images" });
    }
};

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
        res.status(201).json(config.imageUrls);
    } catch (error) {
        console.error("Error adding slideshow image:", error);
        res.status(500).json({ message: "Error adding slideshow image" });
    }
};

exports.deleteImage = async (req, res) => {
    const { imageUrl } = req.body; // Send the URL to delete in the body
    if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required for deletion" });
    }
    try {
        const config = await getConfig();
        const initialLength = config.imageUrls.length;
        config.imageUrls = config.imageUrls.filter(url => url !== imageUrl);

        if (config.imageUrls.length < initialLength) {
            await config.save();
            // Attempt to delete from S3 asynchronously (don't block response)
            deleteS3Object(imageUrl).catch(err => console.error("S3 Deletion Error (async):", err));
            res.json({ message: "Image deleted successfully", images: config.imageUrls });
        } else {
            res.status(404).json({ message: "Image not found in slideshow" });
        }
    } catch (error) {
        console.error("Error deleting slideshow image:", error);
        res.status(500).json({ message: "Error deleting slideshow image" });
    }
};

exports.reorderImages = async (req, res) => {
    const { orderedImageUrls } = req.body; // Send the full ordered array
    if (!Array.isArray(orderedImageUrls)) {
        return res.status(400).json({ message: "Ordered image URLs array is required" });
    }
    try {
        const config = await getConfig();
        config.imageUrls = orderedImageUrls; // Replace with the new order
        await config.save();
        res.json({ message: "Image order updated successfully", images: config.imageUrls });
    } catch (error) {
        console.error("Error reordering slideshow images:", error);
        res.status(500).json({ message: "Error reordering slideshow images" });
    }
};