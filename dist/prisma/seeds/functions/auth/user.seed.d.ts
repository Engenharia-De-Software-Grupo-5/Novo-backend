import { PrismaClient } from '@prisma/client';
export declare function seedUsers(prisma: PrismaClient, permission1: string, permission2: string, condominiumIdA: string, condominiumIdB: string): Promise<{
    admin: {
        id: string;
        email: string;
        name: string;
        password: string;
        isAdminMaster: boolean;
        inviteDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    };
    user: {
        id: string;
        email: string;
        name: string;
        password: string;
        isAdminMaster: boolean;
        inviteDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    };
}>;
