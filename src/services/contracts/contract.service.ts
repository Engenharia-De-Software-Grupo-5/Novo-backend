import { BadRequestException, Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';
import { GenerateContractService } from '../tools/generate-contract.service';
import { randomUUID } from 'node:crypto';
import { MinioClientService } from 'src/services/tools/minio-client.service';

@Injectable()
export class ContractService {
  private readonly allowedExtensions = ['pdf'];

  constructor(
    private readonly minioService: MinioClientService,
    private readonly generateContract: GenerateContractService,
    private readonly contractRepository: ContractRepository,
  ) { }
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
