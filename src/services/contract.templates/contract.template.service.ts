import { Injectable } from '@nestjs/common';
import { ContractTemplateDto } from 'src/contracts/contract.templates/contract.template.dto';
import { ContractTemplateResponse } from 'src/contracts/contract.templates/contract.template.response';
import { ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';

@Injectable()
export class ContractTemplateService {
    constructor(private readonly contractTemplateRepository: ContractTemplateRepository) { }

    getAll(name?: string): Promise<ContractTemplateResponse[]> {
        return this.contractTemplateRepository.getAll(name)
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

