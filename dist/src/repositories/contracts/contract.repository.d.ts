import { PrismaService } from 'src/common/database/prisma.service';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
export declare class ContractRepository {
    private prisma;
    private readonly selectFields;
    constructor(prisma: PrismaService);
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ContractResponse>>;
    getAll(): Promise<ContractResponse[]>;
    getById(contractId: string): Promise<ContractResponse>;
    checkIfHas(dto: ContractDto): Promise<ContractResponse>;
    create(dto: ContractDto): Promise<ContractResponse>;
    update(id: string, dto: ContractDto): Promise<ContractResponse>;
    updateUrl(id: string, url: string): Promise<ContractResponse>;
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
