import { BadRequestException, Injectable } from '@nestjs/common';
import { CondominioDto } from 'src/contracts/condominios/condominio.dto';
import { CondominioResponse } from 'src/contracts/condominios/condominio.response';
import { CondominioRepository } from 'src/repositories/condominios/condominio.repository';

@Injectable()
export class CondominioService {
  constructor(private readonly condominioRepository: CondominioRepository) {}
  getAll(): Promise<CondominioResponse[]> {
    return this.condominioRepository.getAll();
  }
  getById(condominioId: string): Promise<CondominioResponse> {
    return this.condominioRepository.getById(condominioId);
  }

  async create(dto: CondominioDto): Promise<CondominioResponse> {
    const condominioExistente = await this.condominioRepository.getByName(
      dto.nome,
    );

    if (!!condominioExistente) {
      throw new BadRequestException('Esse nome já existe no banco');
    }

    return this.condominioRepository.create(dto);
  }
  update(id: string, dto: CondominioDto): Promise<CondominioResponse> {
    return this.condominioRepository.update(id, dto);
  }

  delete(condominioId: string): Promise<CondominioResponse> {
    return this.condominioRepository.delete(condominioId);
  }
}
