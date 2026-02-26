import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from 'src/contracts/auth/user.dto';
import { UserResponse } from 'src/contracts/auth/user.response';
import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';

@Injectable()
export class CondominiumService {
  constructor(private readonly condominiumRepository: CondominiumRepository) {}
  getAll(): Promise<CondominiumResponse[]> {
    return this.condominiumRepository.getAll();
  }

  getPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<CondominiumResponse>> {
    return this.condominiumRepository.getPaginated(data);
  }
  
  getById(condominiumId: string): Promise<CondominiumResponse> {
    return this.condominiumRepository.getById(condominiumId);
  }

  async create(dto: CondominiumDto): Promise<CondominiumResponse> {
    const condominioExistente = await this.condominiumRepository.getByName(
      dto.name,
    );

    if (condominioExistente) {
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
