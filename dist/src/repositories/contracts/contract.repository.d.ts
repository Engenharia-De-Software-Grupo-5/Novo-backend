import { PrismaService } from 'src/common/database/prisma.service';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
export declare class ContractsRepository {
    private readonly prisma;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ContractResponse>>;
    constructor(prisma: PrismaService);
    getById(contractId: string): import(".prisma/client").Prisma.Prisma__ContractsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    assertContract(contractId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }>;
    create(data: {
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }): import(".prisma/client").Prisma.Prisma__ContractsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    list(params?: {
        tenantCpf?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }[]>;
    softDelete(contractId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }>;
    assertProperty(propertyId: string): Promise<{
        id: string;
    }>;
    assertTenant(tenantId: string): Promise<{
        id: string;
    }>;
    linkLease(contractId: string, propertyId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        contractId: string;
        propertyId: string;
        tenantId: string;
    }>;
    unlinkLease(contractId: string, propertyId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        contractId: string;
        propertyId: string;
        tenantId: string;
    }>;
    listByTenant(tenantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }[]>;
    listByProperty(propertyId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }[]>;
}
