import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
export interface FileInfo {
    fullName: string;
    fileName: string;
    extension: string;
}
export declare class MinioClientService {
    private readonly minio;
    private readonly configService;
    private readonly logger;
    private readonly bucketName;
    private readonly publicMinioClient;
    constructor(minio: MinioService, configService: ConfigService);
    uploadFile(file: Express.Multer.File, allowedExtensions: string[], customFileName: string): Promise<{
        fileName: string;
    }>;
    listFiles(): Promise<FileInfo[]>;
    getFileUrl(fileName: string, expiry?: number): Promise<string>;
    deleteFile(fileName: string): Promise<void>;
}
