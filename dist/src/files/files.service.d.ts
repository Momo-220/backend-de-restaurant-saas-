import { ConfigService } from '@nestjs/config';
export declare class FilesService {
    private configService;
    private readonly uploadsDir;
    private readonly publicDir;
    constructor(configService: ConfigService);
    private ensureDirectoryExists;
    saveFile(buffer: Buffer, filename: string, subfolder?: string): Promise<string>;
    deleteFile(relativePath: string): Promise<boolean>;
    getPublicUrl(relativePath: string): string;
    getFileBuffer(relativePath: string): Promise<Buffer | null>;
    generateUniqueFilename(originalName: string, prefix?: string): string;
    cleanOldFiles(subfolder: string, maxAgeMs: number): Promise<void>;
}
