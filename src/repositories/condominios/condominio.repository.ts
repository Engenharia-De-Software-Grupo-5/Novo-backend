import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { CondominioDto } from 'src/contracts/condominios/condominio.dto';
import { CondominioResponse } from 'src/contracts/condominios/condominio.response';

@Injectable()
export class CondominioRepository {
  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(): Promise<CondominioResponse[]> {
    return this.prisma.condominios.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        nome: true,
        descricao: true,
        endereco: {
          select: {
            id: true,
            cep: true,
            bairro: true,
            cidade: true,
            complemento: true,
            numero: true,
            rua: true,
            uf: true,
          },
        },
      },
    });
  }
  getById(condominioId: string): Promise<CondominioResponse> {
    return this.prisma.condominios.findUnique({
      where: { id: condominioId, deletedAt: null },
      select: {
        id: true,
        nome: true,
        descricao: true,
        endereco: {
          select: {
            id: true,
            cep: true,
            bairro: true,
            cidade: true,
            complemento: true,
            numero: true,
            rua: true,
            uf: true,
          },
        },
      },
    });
  }

  create(dto: CondominioDto): Promise<CondominioResponse> {
    return this.prisma.condominios.create({
      data: { ...dto, endereco: { create: dto.endereco } },
      select: {
        id: true,
        nome: true,
        descricao: true,
        endereco: {
          select: {
            id: true,
            cep: true,
            bairro: true,
            cidade: true,
            complemento: true,
            numero: true,
            rua: true,
            uf: true,
          },
        },
      },
    });
  }
  update(id: string, dto: CondominioDto): Promise<CondominioResponse> {
    return this.prisma.condominios.update({
      where: { id: id },
      data: { ...dto, endereco: { update: { ...dto.endereco } } },
      select: {
        id: true,
        nome: true,
        descricao: true,
        endereco: {
          select: {
            id: true,
            cep: true,
            bairro: true,
            cidade: true,
            complemento: true,
            numero: true,
            rua: true,
            uf: true,
          },
        },
      },
    });
  }

  delete(condominioId: string): Promise<CondominioResponse> {
    return this.prisma.condominios.update({
      where: { id: condominioId },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        nome: true,
        descricao: true,
        endereco: {
          select: {
            id: true,
            cep: true,
            bairro: true,
            cidade: true,
            complemento: true,
            numero: true,
            rua: true,
            uf: true,
          },
        },
      },
    });
  }
}
