// config/aws.js
require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS globally
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Create an S3 instance
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4', // Important for presigned URLs
});

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

module.exports = { s3, S3_BUCKET_NAME };