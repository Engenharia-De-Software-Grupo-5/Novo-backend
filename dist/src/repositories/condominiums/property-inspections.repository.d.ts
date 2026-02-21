import { PrismaService } from 'src/common/database/prisma.service';
export declare class PropertyInspectionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertPropertyOwned(condominiumId: string, propertyId: string): Promise<{
        id: string;
        condominiumId: string;
    }>;
    create(data: {
        condominiumId: string;
        propertyId: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }): import(".prisma/client").Prisma.Prisma__PropertyInspectionsClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
    findOne(condominiumId: string, propertyId: string, inspectionId: string): Promise<{
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
    softDelete(condominiumId: string, propertyId: string, inspectionId: string): Promise<void>;
}
