import { Injectable } from "@nestjs/common";
import { ImovelDto } from "src/contracts/condominios/imovel.dto";
import { ImovelResponse } from "src/contracts/condominios/imovel.dto.response";
import { ImovelRepository } from "src/repositories/condominios/imovel.repository";

@Injectable()
export class ImovelService {
  constructor(private readonly imovelRepository: ImovelRepository) {}
  getAll(condominioId: string): Promise<ImovelResponse[]> {
    return this.imovelRepository.getAll(condominioId);
  }

  getById(condominioId: string, imovelId: string): Promise<ImovelResponse> {
    return this.imovelRepository.getById(condominioId, imovelId);
  }

  getByIdentificador(condominioId: string, identificador: string): Promise<ImovelResponse> {
    return this.imovelRepository.getByIdentificador(condominioId, identificador);
  }

  async create(condominioId: string, dto: ImovelDto): Promise<ImovelResponse> {
    const imovelExistente = await this.imovelRepository.getByIdentificador(
      condominioId,
      dto.identificador,
    );
    if (imovelExistente) {
      throw new Error("Imóvel já cadastrado");
    }
    return this.imovelRepository.create(condominioId, dto);
  }

  update(condominioId: string, imovelId: string, dto: ImovelDto): Promise<ImovelResponse> {
    return this.imovelRepository.update(condominioId,imovelId, dto);
  }
  
  delete(condominioId: string, imovelId: string): Promise<ImovelResponse> {
    return this.imovelRepository.delete(condominioId, imovelId);
  }
}