import dotenv from 'dotenv';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';


dotenv.config();
const uploadRouter = Router();

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const bucketAccess = process.env.AWS_ACCESS_KEY;
const bucketSecret = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: bucketAccess,
    secretAccessKey: bucketSecret
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Corrected upload route
uploadRouter.post(
  '/',
  upload.single('image'),
  asyncHandler(async (req, res) => {

    try {
        const file = req.file.buffer
    if (!file) return res.status(400).send('No files uploaded');

    const key = req.file.originalname.replace(/(\.[\w\d_-]+)$/i, `-${Date.now()}$1`);
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype  // Fixed typo: mimeType → mimetype
      });
      await s3.send(command)
      .then(async (data)=>{
        const imageUrl = `https://d21pczc5ebjcl5.cloudfront.net/${key}`;
        res.send(imageUrl)
        console.log(imageUrl)
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        message: 'Upload failed',
        error: error.message
      });
    }
  })
);

export default uploadRouter;