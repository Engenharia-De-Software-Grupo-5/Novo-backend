import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
import { TenantRepository } from 'src/repositories/tenants/tenant.repository';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}
  getAll(): Promise<TenantResponse[]> {
    return this.tenantRepository.getAll();
  }
  
  getById(tenantId: string): Promise<TenantResponse> {
    return this.tenantRepository.getById(tenantId);
  }
  
  async create(dto: TenantDto): Promise<TenantResponse> {
    const tenantExistente = await this.tenantRepository.getByCpf(
      dto.cpf,
    );
    if (!!tenantExistente) {
      throw new BadRequestException('This tenant CPF already exists in the database.');
    }
    return this.tenantRepository.create(dto);
  }

  update(id: string, dto: TenantDto): Promise<TenantResponse> {
    return this.tenantRepository.update(id, dto);
  }

  delete(tenantId: string): Promise<TenantResponse> {
    return this.tenantRepository.delete(tenantId);
  }
}
