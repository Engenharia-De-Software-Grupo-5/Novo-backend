import { Injectable } from '@nestjs/common';
import { PropertyResponse } from 'src/contracts/condominiums/property.response';
import { ContractTemplateDto as ContractTemplateDto } from 'src/contracts/contract.templates/contract.template.dto';
import { ContractTemplateResponse as ContractTemplateResponse } from 'src/contracts/contract.templates/contract.template.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractTemplateRepository as ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';

@Injectable()
export class ContractTemplateService {
    constructor(private readonly contractTemplateRepository: ContractTemplateRepository) { }

    getAll(condominiumId: string, name?: string): Promise<ContractTemplateResponse[]> {
        return this.contractTemplateRepository.getAll(condominiumId, name)
    }
    getPaginated(
        condominiumId: string,
        data: PaginationDto,
    ): Promise<PaginatedResult<ContractTemplateResponse>> {
        return this.contractTemplateRepository.getPaginated(condominiumId, data);
    }
    getById(condominiumId: string, contractTemplateId: string): Promise<ContractTemplateResponse> {
        return this.contractTemplateRepository.getById(condominiumId, contractTemplateId)
    }
    create(condominiumId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
        return this.contractTemplateRepository.create(condominiumId, dto)
    }
    update(condominiumId: string, contractTemplateId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
        return this.contractTemplateRepository.update(condominiumId, contractTemplateId, dto)
    }
    delete(condominiumId: string, contractTemplateId: string): Promise<ContractTemplateResponse> {
        return this.contractTemplateRepository.delete(condominiumId, contractTemplateId)
    }
}

