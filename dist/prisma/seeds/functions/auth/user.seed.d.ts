import { PrismaClient } from '@prisma/client';
export declare function seedUsers(prisma: PrismaClient, permission1: string, permission2: string): Promise<{
    admin: {
        id: string;
        email: string;
        cpf: string | null;
        name: string;
        password: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        permissionsId: string;
    };
    user: {
        id: string;
        email: string;
        cpf: string | null;
        name: string;
        password: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        permissionsId: string;
    };
    password: any;
}>;
