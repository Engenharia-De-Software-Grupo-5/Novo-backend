import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractsRepository } from 'src/repositories/contracts/contract.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
export declare class ContractsService {
    private readonly repo;
    private readonly minio;
    private readonly allowedExtensions;
    constructor(repo: ContractsRepository, minio: MinioClientService);
    upload(file: Express.Multer.File): Promise<{
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
    listPaginated(data: PaginationDto): Promise<PaginatedResult<ContractResponse>>;
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
    findOne(contractId: string): Promise<{
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
    getDownloadUrl(contractId: string): Promise<{
        url: string;
    }>;
    remove(contractId: string): Promise<void>;
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
