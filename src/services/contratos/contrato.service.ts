import { BadRequestException, Injectable } from '@nestjs/common';
import { CondominioDto } from 'src/contracts/condominios/condominio.dto';
import { ContratoDto } from 'src/contracts/contratos/contrato.dto';
import { ContratoResponse } from 'src/contracts/contratos/contrato.response';
import { ContratoRepository } from 'src/repositories/contratos/contrato.repository';

@Injectable()
export class ContratoService {
  constructor(private readonly contratoRepository: ContratoRepository) {}
  getAll(): Promise<ContratoResponse[]> {
    return this.contratoRepository.getAll();
  }
  getById(contratoId: string): Promise<ContratoResponse> {
    return this.contratoRepository.getById(contratoId);
  }

  async create(dto: ContratoDto): Promise<ContratoResponse> {
    const contratoExistente = await this.contratoRepository.getByName(
      dto.cpfDono && dto.imovel
    );

    if (!!contratoExistente) {
      throw new BadRequestException('Esse nome já existe no banco');
    }

    return this.contratoRepository.create(dto);
  }
  update(id: string, dto: ContratoDto): Promise<ContratoResponse> {
    return this.contratoRepository.update(id, dto);
  }

  delete(contratoId: string): Promise<ContratoResponse> {
    return this.contratoRepository.delete(contratoId);
  }
}
