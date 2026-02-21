import { PrismaClient } from '@prisma/client';
export declare function seedTenants(prisma: PrismaClient): Promise<{
    tenantA: {
        id: string;
        email: string;
        cpf: string;
        name: string;
        status: import(".prisma/client").$Enums.TenantStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        addressId: string;
        condominiumId: string;
        birthDate: Date;
        maritalStatus: string;
        monthlyIncome: number;
        primaryPhone: string;
        secondaryPhone: string | null;
    };
    tenantB: {
        id: string;
        email: string;
        cpf: string;
        name: string;
        status: import(".prisma/client").$Enums.TenantStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        addressId: string;
        condominiumId: string;
        birthDate: Date;
        maritalStatus: string;
        monthlyIncome: number;
        primaryPhone: string;
        secondaryPhone: string | null;
    };
}>;
