import { PrismaClient } from '@prisma/client';
export declare function seedContractTemplates(prisma: PrismaClient): Promise<{
    contractTemplate1: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        template: string;
    };
    contractTemplate2: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        template: string;
    };
}>;
