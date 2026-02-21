import { ContractTemplateDto as ContractTemplateDto } from 'src/contracts/contract.templates/contract.template.dto';
import { ContractTemplateResponse as ContractTemplateResponse } from 'src/contracts/contract.templates/contract.template.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractTemplateRepository as ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';
export declare class ContractTemplateService {
    private readonly contractTemplateRepository;
    constructor(contractTemplateRepository: ContractTemplateRepository);
    getAll(name?: string): Promise<ContractTemplateResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ContractTemplateResponse>>;
    getById(contractTemplateId: string): Promise<ContractTemplateResponse>;
    create(dto: ContractTemplateDto): Promise<ContractTemplateResponse>;
    update(contractTemplateId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse>;
    delete(contractTemplateId: string): Promise<ContractTemplateResponse>;
}
