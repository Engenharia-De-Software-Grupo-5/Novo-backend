import { BadRequestException, Injectable } from '@nestjs/common';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { ContratoRepository } from 'src/repositories/contratos/contrato.repository';

@Injectable()
export class ContratoService {
  constructor(private readonly contratoRepository: ContratoRepository) {}
  getAll(): Promise<ContractResponse[]> {
    return this.contratoRepository.getAll();
  }
  getById(contratoId: string): Promise<ContractResponse> {
    return this.contratoRepository.getById(contratoId);
  }

  async create(dto: ContractDto): Promise<ContractResponse> {
    const contratoExistente = await this.contratoRepository.checkIfHas(dto);

    if (!!contratoExistente) {
      throw new BadRequestException('Esse Contrato já existe no banco');
    }

    return this.contratoRepository.create(dto);
  }
  update(id: string, dto: ContractDto): Promise<ContractResponse> {
    return this.contratoRepository.update(id, dto);
  }

  delete(contratoId: string): Promise<ContractResponse> {
    return this.contratoRepository.delete(contratoId);
  }
}
