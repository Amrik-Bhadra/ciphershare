import { Request, Response } from "express";
import fileService from "../services/file.services";
import { uploadFileToS3 } from "../middlewares/upload.middleware";

class FileController {
    async upload(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ message: "No file uploaded" });
                return;
            }

            // const { key, size, mimetype } = req.file as any;

            const s3Key = await uploadFileToS3(req.file);
            const uploaderId = (req as any).user.id;

            const file = await fileService.uploadFile({
                uploaderId,
                fileName: req.file.originalname, 
                s3Key, 
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                isZip: req.file.mimetype === "application/zip",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            });

            res.status(201).json({
                message: "File uploaded successfully",
                file,
            });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({ message: "Error uploading file", error });
        }
    }

    async download(req: Request, res: Response): Promise<void> {
        try {
            const fileId = req.params.id;
            console.log(fileId);
            const file = await fileService.getFile(fileId);
            console.log(file);

            if (!file) {
                res.status(404).json({ message: "File not found" });
                return;
            }

            if (file.expiresAt && file.expiresAt < new Date()) {
                res.status(410).json({ message: "File expired" });
                return;
            }

            if (file.maxDownloads && file.downloadCount >= file.maxDownloads) {
                res.status(403).json({ message: "Download limit reached" });
                return;
            }

            await fileService.recordDownload(fileId);

            // Generate presigned URL using AWS SDK v3
            const presignedUrl = await fileService.generatePresignedUrl(file.s3Key);

            res.status(200).json({
                message: "File ready for download",
                downloadUrl: presignedUrl,
                s3Key: file.s3Key,
            });
        } catch (error) {
            console.error("Download error:", error);
            res.status(500).json({ message: "Error downloading file", error });
        }
    }
}

export default new FileController();
