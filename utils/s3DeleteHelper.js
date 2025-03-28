// utils/s3DeleteHelper.js (or place in s3Controller.js)
const { s3, S3_BUCKET_NAME } = require('../config/aws');

const deleteS3Object = async (objectUrl) => {
    if (!objectUrl || !objectUrl.startsWith('https://')) {
        console.warn(`Invalid S3 URL provided for deletion: ${objectUrl}`);
        return;
    }
    try {
        // Extract key from URL (this might need adjustment based on your exact URL format)
        const urlParts = objectUrl.split('/');
        const key = urlParts.slice(3).join('/'); // Assumes format https://bucket.s3.region.amazonaws.com/key

        if (!key) {
            console.warn(`Could not extract key from URL: ${objectUrl}`);
            return;
        }

        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: key,
        };
        await s3.deleteObject(params).promise();
        console.log(`Successfully deleted S3 object: ${key}`);
    } catch (error) {
        console.error(`Error deleting S3 object with URL ${objectUrl}:`, error);
        // Decide if you want to throw the error or just log it
    }
};

const deleteS3Objects = async (urls) => {
    if (!Array.isArray(urls) || urls.length === 0) {
        return;
    }
    const deletePromises = urls.map(url => deleteS3Object(url));
    await Promise.all(deletePromises);
};

module.exports = { deleteS3Object, deleteS3Objects };