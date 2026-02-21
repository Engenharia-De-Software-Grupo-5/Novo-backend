import { PrismaClient } from '@prisma/client';
export declare function seedPermissions(prisma: PrismaClient): Promise<{
    permissionAdmin: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        functionalities: string[];
    };
    permissionContractManager: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        functionalities: string[];
    };
}>;
