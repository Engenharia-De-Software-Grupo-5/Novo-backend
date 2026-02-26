import { PrismaClient } from '@prisma/client';
export declare function seedCondominiums(prisma: PrismaClient): Promise<{
    condominiumA: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        addressId: string;
    };
    condominiumB: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        addressId: string;
    };
}>;
