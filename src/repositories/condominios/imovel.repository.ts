import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma.service";
import { ImovelDto } from "src/contracts/condominios/imovel.dto";
import { ImovelResponse } from "src/contracts/condominios/imovel.dto.response";

@Injectable()
export class ImovelRepository {
  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(condominioId: string): Promise<ImovelResponse[]> {
    return this.prisma.imoveis.findMany({
      where: { deletedAt: null, condominiosId: condominioId },
      select: {
        id: true,
        identificador: true,
        endereco: true,
        numeroUnidade: true,
        tipoUnidade: true,
        bloco: true,
        andar: true,
        areaTotal: true,
        situacaoImovel: true,
        observacoes: true,
      },
    });
  }
  getById(condominioId: string, imovelId: string): Promise<ImovelResponse> {
    return this.prisma.imoveis.findFirst({
      where: { id: imovelId, deletedAt: null, condominiosId: condominioId },
      select: {
        id: true,
        identificador: true,
        endereco: true,
        numeroUnidade: true,
        tipoUnidade: true,
        bloco: true,
        andar: true,
        areaTotal: true,
        situacaoImovel: true,
        observacoes: true,
      },
    });
  }
  getByIdentificador(condominioId: string, identificador: string): Promise<ImovelResponse> {
    return this.prisma.imoveis.findUnique({
      where: { identificador, condominiosId: condominioId },
      select: {
        id: true,
        identificador: true,
        endereco: true,
        numeroUnidade: true,
        tipoUnidade: true,
        bloco: true,
        andar: true,
        areaTotal: true,
        situacaoImovel: true,
        observacoes: true,
      },
    });
  }
  create(condominioId: string, dto: ImovelDto): Promise<ImovelResponse> {
    return this.prisma.imoveis.create({
      data: { ...dto, condominiosId: condominioId },
      select: {
        id: true,
        identificador: true,
        endereco: true,
        numeroUnidade: true,
        tipoUnidade: true,
        bloco: true,
        andar: true,
        areaTotal: true,
        situacaoImovel: true,
        observacoes: true,
      },
    });
  }
  update(condominioId: string, imovelId: string, dto: ImovelDto): Promise<ImovelResponse> {
    return this.prisma.imoveis.update({
      where: { id: imovelId, condominiosId: condominioId },
      data: { ...dto },
      select: {
        id: true,
        identificador: true,
        endereco: true,
        numeroUnidade: true,
        tipoUnidade: true,
        bloco: true,
        andar: true,
        areaTotal: true,
        situacaoImovel: true,
        observacoes: true,
      },
    });
  }
  delete(condominioId: string, imovelId: string): Promise<ImovelResponse> {
    return this.prisma.imoveis.update({
      where: { id: imovelId, condominiosId: condominioId },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        identificador: true,
        endereco: true,
        numeroUnidade: true,
        tipoUnidade: true,
        bloco: true,
        andar: true,
        areaTotal: true,
        situacaoImovel: true,
        observacoes: true,
      },
    });
  }
}
