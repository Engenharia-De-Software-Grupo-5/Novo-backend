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

    getAll(name?: string): Promise<ContractTemplateResponse[]> {
        return this.contractTemplateRepository.getAll(name)
    }
    getPaginated(
        data: PaginationDto,
      ): Promise<PaginatedResult<ContractTemplateResponse>> {
        return this.contractTemplateRepository.getPaginated(data);
      }
    
    getById(contractTemplateId: string): Promise<ContractTemplateResponse> {
        return this.contractTemplateRepository.getById(contractTemplateId)
    }
    create(dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
        return this.contractTemplateRepository.create(dto)
    }
    update(contractTemplateId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
        return this.contractTemplateRepository.update(contractTemplateId, dto)
    }
    delete(contractTemplateId: string): Promise<ContractTemplateResponse> {
        return this.contractTemplateRepository.delete(contractTemplateId)
    }
}

