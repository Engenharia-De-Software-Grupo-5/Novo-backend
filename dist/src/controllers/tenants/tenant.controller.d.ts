import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
import { TenantService } from 'src/services/tenants/tenant.service';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    getAll(): Promise<TenantResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<TenantResponse>>;
    getByCpf(cpf: string): Promise<TenantResponse>;
    getById(tenantId: string): Promise<TenantResponse>;
    create(dto: TenantDto): Promise<TenantResponse>;
    update(id: string, dto: TenantDto): Promise<TenantResponse>;
    deleteByCpf(cpf: string): Promise<TenantResponse>;
    delete(tenantId: string): Promise<TenantResponse>;
}
