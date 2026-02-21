import { PropertyDocumentsService } from 'src/services/condominiums/property-documents.repository';
export declare class PropertyDocumentsController {
    private readonly service;
    constructor(service: PropertyDocumentsService);
    upload(condominiumId: string, propertyId: string, file?: Express.Multer.File): Promise<{
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
    download(condominiumId: string, propertyId: string, documentId: string): Promise<{
        url: string;
    }>;
    remove(condominiumId: string, propertyId: string, documentId: string): Promise<void>;
}
