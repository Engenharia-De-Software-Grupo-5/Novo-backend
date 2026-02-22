import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractsService } from 'src/services/contracts/contract.service';
export declare class ContractsController {
    private readonly service;
    constructor(service: ContractsService);
    upload(file?: Express.Multer.File): Promise<{
        id: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    list(tenantCpf?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ContractResponse>>;
    findOne(id: string): Promise<{
        url: string;
        id: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    download(id: string): Promise<{
        url: string;
    }>;
    remove(id: string): Promise<void>;
    linkLease(id: string, tenantId: string, propertyId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        contractId: string;
        propertyId: string;
    }>;
    unlinkLease(id: string, tenantId: string, propertyId: string): Promise<void>;
    listByTenant(tenantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    listByProperty(propertyId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
}
