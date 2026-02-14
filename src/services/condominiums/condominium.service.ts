import { BadRequestException, Injectable } from '@nestjs/common';
import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';

@Injectable()
export class CondominiumService {
  constructor(private readonly condominiumRepository: CondominiumRepository) {}
  getAll(): Promise<CondominiumResponse[]> {
    return this.condominiumRepository.getAll();
  }
  getById(condominiumId: string): Promise<CondominiumResponse> {
    return this.condominiumRepository.getById(condominiumId);
  }

  async create(dto: CondominiumDto): Promise<CondominiumResponse> {
    const condominioExistente = await this.condominiumRepository.getByName(
      dto.name,
    );

    if (!!condominioExistente) {
      throw new BadRequestException('This condominium name already exists in the database.');
    }

    return this.condominiumRepository.create(dto);
  }
  update(id: string, dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.condominiumRepository.update(id, dto);
  }

  delete(condominiumId: string): Promise<CondominiumResponse> {
    return this.condominiumRepository.delete(condominiumId);
  }
}
