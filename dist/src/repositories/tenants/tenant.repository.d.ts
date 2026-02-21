import { PrismaService } from 'src/common/database/prisma.service';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
export declare class TenantRepository {
    private prisma;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<TenantResponse>>;
    private readonly tenantSelect;
    constructor(prisma: PrismaService);
    getAll(): Promise<TenantResponse[]>;
    getById(tenantId: string): Promise<TenantResponse>;
    getByCpf(cpf: string): Promise<TenantResponse>;
    create(dto: TenantDto): Promise<TenantResponse>;
    update(tenantId: string, dto: TenantDto): Promise<TenantResponse>;
    deleteByCpf(cpf: string): Promise<TenantResponse>;
    deleteById(tenantId: string): Promise<TenantResponse>;
}
