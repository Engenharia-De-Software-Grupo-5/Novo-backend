import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ContratoDto } from 'src/contracts/contratos/contrato.dto';
import { ContratoResponse } from 'src/contracts/contratos/contrato.response';

@Injectable()
export class ContratoRepository {
  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(): Promise<ContratoResponse[]> {
    return this.prisma.contratos.findMany({
      where: { deletedAt: null },
      select: {
      },
    });
  }
  getById(condominioId: string): Promise<ContratoResponse> {
    return this.prisma.condominios.contratos.findUnique({
      where: { id: condominioId, deletedAt: null },
      select: {
      },
    });
  }

  getByName(nome: string): Promise<ContratoResponse> {
    return this.prisma.contratos.findUnique({
      where: { nome },
      select: {
      },
    });
  }

  create(dto: ContratoDto): Promise<ContratoResponse> {
    return this.prisma.condominios.create({
      data: { ...dto },
      select: {
      },
    });
  }
  update(id: string, dto: ContratoDto): Promise<ContratoResponse> {
    return this.prisma.condominios.update({
      where: { id: id },
      data: { ...dto },
      select: {
      },
    });
  }

  delete(contratoId: string): Promise<ContratoResponse> {
    return this.prisma.condominios.update({
      where: { id: contratoId },
      data: { deletedAt: new Date() },
      select: {
      },
    });
  }
}
