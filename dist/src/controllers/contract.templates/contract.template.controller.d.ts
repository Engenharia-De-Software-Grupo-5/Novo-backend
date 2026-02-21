import { ContractTemplateDto } from "src/contracts/contract.templates/contract.template.dto";
import { ContractTemplateResponse } from "src/contracts/contract.templates/contract.template.response";
import { PaginatedResult } from "src/contracts/pagination/paginated.result";
import { PaginationDto } from "src/contracts/pagination/pagination.dto";
import { ContractTemplateService } from "src/services/contract.templates/contract.template.service";
export declare class ContractTemplateController {
    private readonly contractTemplateService;
    constructor(contractTemplateService: ContractTemplateService);
    getAll(name?: string): Promise<ContractTemplateResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ContractTemplateResponse>>;
    getById(contractTemplateId: string): Promise<ContractTemplateResponse>;
    create(dto: ContractTemplateDto): Promise<ContractTemplateResponse>;
    update(contractTemplateId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse>;
    delete(contractTemplateId: string): Promise<ContractTemplateResponse>;
}
