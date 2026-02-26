import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { GenerateContractService } from '../tools/generate-contract.service';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
export declare class ContractService {
    private readonly minioService;
    private readonly generateContract;
    private readonly repo;
    private readonly allowedExtensions;
    constructor(minioService: MinioClientService, generateContract: GenerateContractService, repo: ContractRepository);
    getAll(): Promise<ContractResponse[]>;
    listPaginated(data: PaginationDto): Promise<PaginatedResult<ContractResponse>>;
    getById(contratoId: string): Promise<ContractResponse>;
    create(dto: ContractDto, file?: Express.Multer.File): Promise<ContractResponse>;
    update(id: string, dto: ContractDto): Promise<ContractResponse>;
    delete(contratoId: string): Promise<ContractResponse>;
    listByTenant(tenantId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        content: string | null;
        propertyId: string;
        contractUrl: string | null;
        tenantId: string;
        contractTemplateId: string | null;
    }[]>;
    listByProperty(propertyId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        content: string | null;
        propertyId: string;
        contractUrl: string | null;
        tenantId: string;
        contractTemplateId: string | null;
    }[]>;
}
