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
        adress: {
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
        properties: { where: { deletedAt: null },
          select: {
            id: true, 
            identifier: true,
            adress: true,
            unityNumber: true,
            unityType: true,
            block: true,
            floor: true,
            propertySituation: true,
            observations: true,
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
        adress: {
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
        properties: { where: { deletedAt: null },
          select: {
            id: true,
            identifier: true,
            adress: true,
            unityNumber: true,
            unityType: true,
            block: true,
            floor: true,
            propertySituation: true,
            observations: true,
         },
        },
          },
      });
    }


  getByName(name: string): Promise<CondominiumResponse> {
    return this.prisma.condominiums.findUnique({
      where: { name, deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        adress: {
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
        properties: { where: { deletedAt: null },
          select: { 
            id: true,
            identifier: true,
            adress: true,
            unityNumber: true,
            unityType: true,
            block: true,
            floor: true,
            propertySituation: true,
            observations: true,
         },
        },
          },
      });
    }

  create(dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.prisma.condominiums.create({
      data: { ...dto, adress: { create: dto.adress }},
      select: {
        id: true,
        name: true,
        description: true,
        adress: {
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
        properties: { where: { deletedAt: null },
          select: {
            id: true,
            identifier: true,
            adress: true,
            unityNumber: true,
            unityType: true,
            block: true,
            floor: true,
            propertySituation: true,
            observations: true,
         },
        },
          },
      });
    }
  update(id: string, dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.prisma.condominiums.update({
      where: { id: id },
      data: { ...dto, adress: { update: { ...dto.adress } }},
      select: {
        id: true,
        name: true,
        description: true,
        adress: {
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
        properties: { where: { deletedAt: null },
          select: {
            id: true,
            identifier: true,
            adress: true,
            unityNumber: true,
            unityType: true,
            block: true,
            floor: true,
            propertySituation: true,
            observations: true,
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
        adress: {
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
        properties: { where: { deletedAt: null },
          select: {
            id: true,
            identifier: true,
            adress: true,
            unityNumber: true,
            unityType: true,
            block: true,
            floor: true,
            propertySituation: true,
            observations: true,
         },
        },
          },
      });
    }
  }
