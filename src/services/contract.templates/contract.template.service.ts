import { Injectable } from '@nestjs/common';
import { ContractTemplateDto } from 'src/contracts/contract.templates/contract.template.dto';
import { ContractTemplateResponse } from 'src/contracts/contract.templates/contract.template.response';
import { ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';

@Injectable()
export class ContractTemplateService {
    constructor(private readonly contractTemplateRepository: ContractTemplateRepository) { }

    getAll(condominiumId: string, name?: string): Promise<ContractTemplateResponse[]> {
        return this.contractTemplateRepository.getAll(condominiumId, name)
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

