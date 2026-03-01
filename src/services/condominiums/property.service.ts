import { ConflictException, Injectable } from "@nestjs/common";
import { PropertyDto } from "src/contracts/condominiums/property.dto";
import { PropertyResponse } from "src/contracts/condominiums/property.response";
import { PaginatedResult } from "src/contracts/pagination/paginated.result";
import { PaginationDto } from "src/contracts/pagination/pagination.dto";
import { PropertyRepository } from "src/repositories/condominiums/property.repository";
import { MinioClientService } from "../tools/minio-client.service";

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly minioClienteService: MinioClientService) {}
  async getAll(condominiumId: string): Promise<PropertyResponse[]> {
    const result = await this.propertyRepository.getAll(condominiumId);
    
    for(let i = 0; i < result.length; i++){
      for(let j = 0; j < result[i].files.length; i++){
        const tempUrl = await this.minioClienteService.getFileUrl( result[i][j] )
        result[i].files[j].link = tempUrl
      }
    }

    return result;
  }

  getPaginated(
    condominiumId: string,
    data: PaginationDto,
  ): Promise<PaginatedResult<PropertyResponse>> {
    return this.propertyRepository.getPaginated(condominiumId, data);
  }

  async getById(condominiumId: string, propertyId: string): Promise<PropertyResponse> {
    const result = await this.propertyRepository.getById(condominiumId, propertyId);

    for(let i = 0; i < result.files.length; i++){
      const tempUrl = await this.minioClienteService.getFileUrl(result.files[i].link)
      result.files[i].link = tempUrl;
    }

    return result;
  }

  getByIdentificador(condominiumId: string, identificador: string): Promise<PropertyResponse> {
    return this.propertyRepository.getByIdentificador(condominiumId, identificador);
  }

  async create(
    condominiumId: string, 
    dto: PropertyDto,
    inspections: Express.Multer.File[],
    documents: Express.Multer.File[]
  ): Promise<PropertyResponse> {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'];

    const propertyExistente = await this.propertyRepository.getByIdentificador(
      condominiumId,
      dto.identifier,
    );
    if (propertyExistente) {
      throw new ConflictException('Property with this identifier already exists in this condominium in the database.');
    }

    let inspectionFileNameList: string[] = [];
    let documentFileNameList: string[] = [];

    // Proteção: Só tenta fazer upload se a array de arquivos existir e tiver itens
    if (inspections && inspections.length > 0) {
      const uploadResponses = await Promise.all(
        inspections.map((file) =>
          this.minioClienteService.uploadFile(
            file,
            allowedExtensions,
            file.originalname,
          ),
        ),
      );
      inspectionFileNameList = uploadResponses.map((r) => r.fileName);
    }

    if (documents && documents.length > 0) {
      const uploadResponses = await Promise.all(
        inspections.map((file) =>
          this.minioClienteService.uploadFile(
            file,
            allowedExtensions,
            file.originalname,
          ),
        ),
      );
      documentFileNameList = uploadResponses.map((r) => r.fileName);
    }

    return this.propertyRepository.create(
      condominiumId,
      dto, 
      inspectionFileNameList, 
      documentFileNameList, 
      inspections,
      documents
    );
  }

  update(condominiumId  : string, propertyId: string, dto: PropertyDto): Promise<PropertyResponse> {
    return this.propertyRepository.update(condominiumId, propertyId, dto);
  }
  
  delete(condominiumId: string, propertyId: string): Promise<PropertyResponse> {
    return this.propertyRepository.delete(condominiumId, propertyId);
  }
}