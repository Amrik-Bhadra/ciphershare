import { Schema, Document, model, Types } from "mongoose";

export interface IFile extends Document {
    uploaderId: string;
    fileName: string;
    s3Key: string;
    fileSize: number;
    mimeType: string;
    isZip: boolean;
    expiresAt: Date,
    maxDownloads: number;
    downloadCount: number;
}

const fileSchema = new Schema<IFile>({
    uploaderId: { type: String, required: true },
    fileName: { type: String, required: true },       
    s3Key: { type: String, required: true },           
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    isZip: { type: Boolean, default: false },         
    expiresAt: { type: Date },                         
    maxDownloads: { type: Number, default: null },     
    downloadCount: { type: Number, default: 0 },
}, { timestamps: true });

export const File = model<IFile>("File", fileSchema);