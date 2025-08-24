import { IFileRepository } from "../interfaces/IFileRepository";
import { File, IFile } from "../models/file.model";

class FileRepository implements IFileRepository {
    async create(fileData: Partial<IFile>): Promise<IFile> {
        const file = new File(fileData);
        return await file.save();
    }

    async findById(id: string): Promise<IFile | null> {
        return await File.findById(id);
    }

    async incrementDownloadCount(id: string): Promise<IFile | null> {
        return await File.findByIdAndUpdate(
            id,
            { $inc: { downloadCount: 1 } },
            { new: true }
        );
    }

    async deleteById(id: string): Promise<IFile | null> {
        return await File.findByIdAndDelete(id);
    }
}

export default new FileRepository();