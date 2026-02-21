import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractsService } from 'src/services/contracts/contract.service';
export declare class ContractsController {
    private readonly service;
    constructor(service: ContractsService);
    upload(file?: Express.Multer.File): Promise<{
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
    list(tenantCpf?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ContractResponse>>;
    findOne(id: string): Promise<{
        url: string;
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
    download(id: string): Promise<{
        url: string;
    }>;
    remove(id: string): Promise<void>;
    linkLease(id: string, tenantId: string, propertyId: string): Promise<{
        id: string;
        createdAt: Date;
        contractId: string;
        propertyId: string;
        tenantId: string;
    }>;
    unlinkLease(id: string, tenantId: string, propertyId: string): Promise<void>;
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
