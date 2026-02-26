import { PrismaService } from "src/common/database/prisma.service";
import { ContractTemplateDto } from "src/contracts/contract.templates/contract.template.dto";
import { ContractTemplateResponse } from "src/contracts/contract.templates/contract.template.response";
import { PaginatedResult } from "src/contracts/pagination/paginated.result";
import { PaginationDto } from "src/contracts/pagination/pagination.dto";
export declare class ContractTemplateRepository {
    private prisma;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ContractTemplateResponse>>;
    constructor(prisma: PrismaService);
    getById(contractTemplateId: string): Promise<ContractTemplateResponse>;
    getAll(name?: string): Promise<ContractTemplateResponse[]>;
    create(dto: ContractTemplateDto): Promise<ContractTemplateResponse>;
    update(contractTemplateId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse>;
    delete(contractTemplateId: string): Promise<ContractTemplateResponse>;
}
