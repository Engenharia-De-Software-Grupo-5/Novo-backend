import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
import { TenantPatchDto } from 'src/contracts/tenants/tenantPatch.dto';
import { TenantRepository } from 'src/repositories/tenants/tenant.repository';

@Injectable()
export class TenantService {
  getPaginated(
    condId: string,
    data: PaginationDto,
  ): Promise<PaginatedResult<TenantResponse>> {
    return this.tenantRepository.getPaginated(condId, data);
  }

  constructor(private readonly tenantRepository: TenantRepository) {}
  getAll(condId: string): Promise<TenantResponse[]> {
    return this.tenantRepository.getAll(condId);
  }
  
  async getById(condId: string, tenantId: string): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(condId, tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }
  
  async create(condId: string, dto: TenantDto): Promise<TenantResponse> {
    const tenantExistente = await this.tenantRepository.getByCpf(
      condId,
      dto.cpf,
    );
    if (tenantExistente) {
      throw new BadRequestException('This tenant CPF already exists in the database.');
    }

    return this.tenantRepository.create(condId, dto);
  }

  async update(condId: string, id: string, dto: TenantPatchDto): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(condId, id);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return this.tenantRepository.update(condId, id, dto);
  }

  async updateStatus(
    condId: string,
    id: string,
    dto: TenantPatchDto,
  ): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(condId, id);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const updated = await this.tenantRepository.update(condId, id, dto);

    return updated;
  }

  async deleteById(condId: string, tenantId: string): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(condId, tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return this.tenantRepository.deleteById(condId, tenantId);
  }
}