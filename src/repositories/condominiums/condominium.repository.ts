import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';

@Injectable()
export class CondominiumRepository {
  private readonly condominiumSelect = {
    id: true,
    name: true,
    description: true,
    address: {
      select: {
        id: true,
        zip: true,
        neighborhood: true,
        city: true,
        complement: true,
        number: true,
        street: true,
        uf: true,
      },
    },
    properties: {
      where: { deletedAt: null },
      select: {
        id: true,
        identifier: true,
        address: true,
        totalArea: true,
        unityNumber: true,
        unityType: true,
        block: true,
        floor: true,
        propertySituation: true,
        observations: true,
      },
    },
  };

  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(): Promise<CondominiumResponse[]> {
    return this.prisma.condominiums.findMany({
      where: { deletedAt: null },
      select: this.condominiumSelect,
    });
  }
  getById(condominiumId: string): Promise<CondominiumResponse> {
    return this.prisma.condominiums.findFirst({
      where: { id: condominiumId, deletedAt: null },
      select: this.condominiumSelect,
    });
  }


  getByName(name: string): Promise<CondominiumResponse> {
    return this.prisma.condominiums.findFirst({
      where: { name, deletedAt: null },
      select: this.condominiumSelect,
    });
  }

  create(dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.prisma.condominiums.create({
      data: { ...dto, address: { create: dto.address }},
      select: this.condominiumSelect,
    });
  }
  update(id: string, dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.prisma.condominiums.update({
      where: { id: id },
      data: { ...dto, address: { update: { ...dto.address } }},
      select: this.condominiumSelect,
    });
  }

    delete(condominiumId: string): Promise<CondominiumResponse> {
      return this.prisma.condominiums.update({
        where: { id: condominiumId },
        data: { deletedAt: new Date() },
        select: this.condominiumSelect,
      });
    }
  }
