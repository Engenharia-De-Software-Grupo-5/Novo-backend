import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';

@Injectable()
export class TenantRepository {
  private readonly tenantSelect = {
    id: true,
    name: true,
    cpf: true,
  };

  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(): Promise<TenantResponse[]> {
    return this.prisma.tenants.findMany({
      where: { deletedAt: null },
      select: this.tenantSelect,
    });
  }
  getById(tenantId: string): Promise<TenantResponse> {
    return this.prisma.tenants.findFirst({
      where: { id: tenantId, deletedAt: null },
      select: this.tenantSelect,
    });
  }

  getByCpf(cpf: string): Promise<TenantResponse> {
    return this.prisma.tenants.findFirst({
      where: { cpf, deletedAt: null },
      select: this.tenantSelect,
    });
  }

  create(dto: TenantDto): Promise<TenantResponse> {
    return this.prisma.tenants.create({
      data: {
        name: dto.name,
        cpf: dto.cpf,
      },
      select: this.tenantSelect,
    });
  }

  update(tenantId: string, dto: TenantDto): Promise<TenantResponse> {
    return this.prisma.tenants.update({
      where: { id: tenantId },
      data: {
        name: dto.name,
        cpf: dto.cpf,
      },
      select: this.tenantSelect,
    });
  }
  delete(tenantId: string): Promise<TenantResponse> {
    return this.prisma.tenants.update({
      where: { id: tenantId },
      data: { deletedAt: new Date() },
      select: this.tenantSelect,
    });
  }
}
