import { IFileRepository } from "../interfaces/IFileRepository";
import { IFile } from "../models/file.model";
import fileRepository from "../repositories/file.repository";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/awsS3.config";

class FileService {
  constructor(fileRepository: IFileRepository) {}

  async uploadFile(data: Partial<IFile>): Promise<IFile> {
    return await fileRepository.create(data);
  }

  async getFile(fileId: string): Promise<IFile | null> {
    return await fileRepository.findById(fileId);
  }

  async recordDownload(fileId: string): Promise<IFile | null> {
    return await fileRepository.incrementDownloadCount(fileId);
  }

  async deleteFile(fileId: string): Promise<IFile | null> {
    return await fileRepository.deleteById(fileId);
  }

  async generatePresignedUrl(s3Key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: s3Key,
    });

    // AWS SDK v3 way of generating presigned URL
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 mins
    return url;
  }
}

export default new FileService(fileRepository);
