// controllers/s3Controller.js
const { s3, S3_BUCKET_NAME } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

exports.getPresignedUrl = async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        // ... validation ...
        const fileExtension = fileName.split('.').pop();
        const uniqueKey = `${uuidv4()}.${fileExtension}`;

        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: uniqueKey,
            Expires: 60 * 5,
            ContentType: fileType,
            // ACL: 'public-read', // <--- REMOVE THIS LINE
        };

        // Re-generate the presigned URL without the ACL parameter
        const presignedUrl = await s3.getSignedUrlPromise('putObject', params);

        const objectUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

        // Send back the URL *without* x-amz-acl in the query string
        res.json({ presignedUrl, objectUrl, key: uniqueKey });

    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate presigned URL' });
    }
};