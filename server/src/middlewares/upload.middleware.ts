import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import crypto from "crypto";
import s3 from "../config/awsS3.config";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadFileToS3 = async (file: Express.Multer.File) => {
  const uniqueKey = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${path.extname(file.originalname)}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: uniqueKey,
    Body: file.buffer, // because we're using memoryStorage
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return uniqueKey; // you can return this key to save in DB
};

export default upload;
