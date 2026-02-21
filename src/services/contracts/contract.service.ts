import { BadRequestException, Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { Multer } from 'multer';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';

@Injectable()
export class ContractService {
  private readonly allowedExtensions = ['pdf'];

  constructor(
    private readonly contractRepository: ContractRepository,
  ) {}
  getAll(): Promise<ContractResponse[]> {
    return this.contractRepository.getAll();
  }
  getById(contratoId: string): Promise<ContractResponse> {
    return this.contractRepository.getById(contratoId);
  }

  async create(dto: ContractDto): Promise<ContractResponse> {
    const contratoExistente = await this.contractRepository.checkIfHas(dto);
    if (contratoExistente) {
      throw new BadRequestException('This contract already exists');
    }
    
    return this.contractRepository.create(dto);
  }
  update(id: string, dto: ContractDto): Promise<ContractResponse> {
    return this.contractRepository.update(id, dto);
  }

  delete(contratoId: string): Promise<ContractResponse> {
    return this.contractRepository.delete(contratoId);
  }

  listByTenant(tenantId: string) {
    return this.contractRepository.listByTenant(tenantId);
  }

  listByProperty(propertyId: string) {
    return this.contractRepository.listByProperty(propertyId);
  }
}
