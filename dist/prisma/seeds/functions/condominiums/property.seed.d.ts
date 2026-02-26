import { PrismaClient } from '@prisma/client';
export declare function seedProperties(prisma: PrismaClient, condominiumId: string): Promise<{
    property1: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        address: string;
        identifier: string;
        unityNumber: string;
        unityType: import(".prisma/client").$Enums.UnityType;
        block: string | null;
        floor: number | null;
        totalArea: number | null;
        propertySituation: import(".prisma/client").$Enums.PropertySituation;
        observations: string | null;
        condominiumId: string | null;
    };
    property2: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        address: string;
        identifier: string;
        unityNumber: string;
        unityType: import(".prisma/client").$Enums.UnityType;
        block: string | null;
        floor: number | null;
        totalArea: number | null;
        propertySituation: import(".prisma/client").$Enums.PropertySituation;
        observations: string | null;
        condominiumId: string | null;
    };
}>;
