import { BadRequestException, Injectable } from '@nestjs/common';
import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
import { UserService } from '../auth/user.service';
import { AuthPayload, UserDto } from 'src/contracts/auth';

@Injectable()
export class CondominiumService {
  constructor(private readonly condominiumRepository: CondominiumRepository,
              private readonly userService: UserService) {}
  getAll(): Promise<CondominiumResponse[]> {
    return this.condominiumRepository.getAll();
  }
  getById(condominiumId: string): Promise<CondominiumResponse> {
    return this.condominiumRepository.getById(condominiumId);
  }

  async create(dto: CondominiumDto, user: AuthPayload): Promise<CondominiumResponse> {
    const condominioExistente = await this.condominiumRepository.getByName(
      dto.name,
    );

    if (condominioExistente) {
      throw new BadRequestException('This condominium name already exists in the database.');
    }
    
    const condominio = await this.condominiumRepository.create(dto);
    const userDto: UserDto = {
      email: user.email,
      name: user.name,
      role: 'Admin',
    };

    await this.userService.create(userDto, condominio.id)
    
    return condominio
  }
  update(id: string, dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.condominiumRepository.update(id, dto);
  }

  delete(condominiumId: string): Promise<CondominiumResponse> {
    return this.condominiumRepository.delete(condominiumId);
  }
}
