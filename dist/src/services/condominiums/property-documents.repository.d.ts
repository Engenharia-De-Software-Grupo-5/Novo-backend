import { MinioClientService } from 'src/services/tools/minio-client.service';
import { PropertyDocumentsRepository } from 'src/repositories/condominiums/property-documents.repository';
export declare class PropertyDocumentsService {
    private readonly repo;
    private readonly minio;
    private readonly allowedExtensions;
    constructor(repo: PropertyDocumentsRepository, minio: MinioClientService);
    upload(condominiumId: string, propertyId: string, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        propertyId: string;
    }>;
    list(condominiumId: string, propertyId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        propertyId: string;
    }[]>;
    findOne(condominiumId: string, propertyId: string, documentId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        propertyId: string;
    }>;
    getDownloadUrl(condominiumId: string, propertyId: string, documentId: string): Promise<{
        url: string;
    }>;
    remove(condominiumId: string, propertyId: string, documentId: string): Promise<void>;
}
