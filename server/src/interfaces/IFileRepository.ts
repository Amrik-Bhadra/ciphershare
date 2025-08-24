import { IFile } from "../models/file.model";

export interface IFileRepository {
    create(fileData: Partial<IFile>): Promise<IFile>;
    findById(id: string): Promise<IFile | null>;
    incrementDownloadCount(id: string): Promise<IFile | null>;
    deleteById(id: string): Promise<IFile | null>;
}