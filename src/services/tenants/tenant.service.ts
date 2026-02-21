import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
import { TenantRepository } from 'src/repositories/tenants/tenant.repository';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}
  getAll(): Promise<TenantResponse[]> {
    return this.tenantRepository.getAll();
  }

  async getByCpf(cpf: string): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getByCpf(cpf);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }
  
  async getById(tenantId: string): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
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

  async update(id: string, dto: TenantDto): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(id);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return this.tenantRepository.update(id, dto);
  }

  async deleteByCpf(cpf: string): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getByCpf(cpf);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return this.tenantRepository.deleteByCpf(cpf);  
  }

  async deleteById(tenantId: string): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return this.tenantRepository.deleteById(tenantId);
  }
}