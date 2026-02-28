import { BadRequestException, Injectable } from '@nestjs/common';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { GenerateContractService } from '../tools/generate-contract.service';
import { ContractDto } from 'src/contracts/contracts/contract.dto';

@Injectable()
export class ContractService {
  private readonly allowedExtensions = ['pdf'];

  constructor(
    private readonly minioService: MinioClientService,
    private readonly generateContract: GenerateContractService,
    private readonly contractRepository: ContractRepository,
  ) { }

  listPaginated(
    condominiumId: string,
    data: PaginationDto,
  ): Promise<PaginatedResult<ContractResponse>> {
    return this.contractRepository.getPaginated(condominiumId, data);
  }
  getAll(condominiumId: string): Promise<ContractResponse[]> {
    return this.contractRepository.getAll(condominiumId);
  }
  async getById(condominiumId: string, contratoId: string): Promise<ContractResponse> {
    const result = await this.contractRepository.getById(condominiumId, contratoId);
    const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
    result.contractUrl = tempUrl;
    return result;
  }

  async create(
    condominiumId: string,
    dto: ContractDto,
    file?: Express.Multer.File,
  ): Promise<ContractResponse> {
    const contratoExistente = await this.contractRepository.checkIfHas(condominiumId, dto);
    if (contratoExistente) {
      throw new BadRequestException('This contract already exists');
    }

    if (dto.contractTemplateId) {
      const response = await this.contractRepository.create(condominiumId, dto);
      const urlPromise = await this.generateContract.execute(response.id, dto.content);
      const result = await this.contractRepository.updateUrl(
        condominiumId,
        response.id,
        urlPromise.url,
      );

      const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
      result.contractUrl = tempUrl;
      return result;
    } else {
      const response = await this.contractRepository.create(condominiumId, dto);
      const minioResponse = await this.minioService.uploadFile(
        file,
        ['pdf'],
        response.id + '_' + new Date().getTime() + '.pdf',
      );
      const result = await this.contractRepository.updateUrl(
        condominiumId,
        response.id,
        minioResponse.fileName,
      );

      const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
      result.contractUrl = tempUrl;
      return result;
    }
  }
  update(condominiumId: string, id: string, dto: ContractDto): Promise<ContractResponse> {
    return this.contractRepository.update(condominiumId, id, dto);
  }

  delete(condominiumId: string, contratoId: string): Promise<ContractResponse> {
    return this.contractRepository.delete(condominiumId, contratoId);
  }

  listByTenant(condominiumId, tenantId: string) {
    return this.contractRepository.listByTenant(condominiumId, tenantId);
  }

  listByProperty(condominiumId, propertyId: string) {
    return this.contractRepository.listByProperty(condominiumId, propertyId);
  }
}
