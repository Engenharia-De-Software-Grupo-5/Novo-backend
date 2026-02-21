import { AuthPayload } from 'src/contracts/auth';
import { AuthJwtResponse } from 'src/contracts/auth/jwt.response';
import { AppService } from 'src/services/app.service';
import { MinioClientService } from 'src/services/tools/minio-client.service';
export declare class AppController {
    private readonly appService;
    private readonly minioClientService;
    constructor(appService: AppService, minioClientService: MinioClientService);
    getHello(): string;
    getMe(user: AuthPayload): AuthJwtResponse;
    uploadFile(file: Express.Multer.File): Promise<{
        fileName: string;
    }>;
    getFileAccessUrl(fileName: string): Promise<{
        url: string;
    }>;
    deleteFile(fileName: string): Promise<{
        message: string;
    }>;
}
