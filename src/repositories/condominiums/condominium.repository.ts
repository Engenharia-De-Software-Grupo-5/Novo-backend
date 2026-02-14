import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';

@Injectable()
export class CondominiumRepository {
  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(): Promise<CondominiumResponse[]> {
    return this.prisma.condominiums.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            cep: true,
            neighborhood: true,
            city: true,
            complement: true,
            number: true,
            street: true,
            state: true,
          },
        },
      },
    });
  }
  getById(condominiumId: string): Promise<CondominiumResponse> {
    return this.prisma.condominiums.findUnique({
      where: { id: condominiumId, deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            cep: true,
            neighborhood: true,
            city: true,
            complement: true,
            number: true,
            street: true,
            state: true,
          },
        },
      },
    });
  }

  getByName(name: string): Promise<CondominiumResponse> {
    return this.prisma.condominiums.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            cep: true,
            neighborhood: true,
            city: true,
            complement: true,
            number: true,
            street: true,
            state: true,
          },
        },
      },
    });
  }

  create(dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.prisma.condominiums.create({
      data: { ...dto, address: { create: dto.address } },
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            cep: true,
            neighborhood: true,
            city: true,
            complement: true,
            number: true,
            street: true,
            state: true,
          },
        },
      },
    });
  }
  update(id: string, dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.prisma.condominiums.update({
      where: { id: id },
      data: { ...dto, address: { update: { ...dto.address } } },
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            cep: true,
            neighborhood: true,
            city: true,
            complement: true,
            number: true,
            street: true,
            state: true,
          },
        },
      },
    });
  }

  delete(condominiumId: string): Promise<CondominiumResponse> {
    return this.prisma.condominiums.update({
      where: { id: condominiumId },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            cep: true,
            neighborhood: true,
            city: true,
            complement: true,
            number: true,
            street: true,
            state: true,
          },
        },
      },
    });
  }
}
