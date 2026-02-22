import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
import { TenantRepository } from 'src/repositories/tenants/tenant.repository';
export declare class TenantService {
    private readonly tenantRepository;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<TenantResponse>>;
    constructor(tenantRepository: TenantRepository);
    getAll(): Promise<TenantResponse[]>;
    getByCpf(cpf: string): Promise<TenantResponse>;
    getById(tenantId: string): Promise<TenantResponse>;
    create(dto: TenantDto): Promise<TenantResponse>;
    update(id: string, dto: TenantDto): Promise<TenantResponse>;
    deleteByCpf(cpf: string): Promise<TenantResponse>;
    deleteById(tenantId: string): Promise<TenantResponse>;
}
