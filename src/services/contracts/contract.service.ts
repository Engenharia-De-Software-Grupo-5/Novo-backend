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
    private readonly repo: ContractRepository,
  ) { }
  getAll(): Promise<ContractResponse[]> {
    return this.repo.getAll();
  }

  listPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<ContractResponse>> {
    return this.repo.getPaginated(data);
  }
  async getById(contratoId: string): Promise<ContractResponse> {
    const result = await this.repo.getById(contratoId);
    const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
    result.contractUrl = tempUrl;
    return result;
  }

  async create(
    dto: ContractDto,
    file?: Express.Multer.File,
  ): Promise<ContractResponse> {
    const contratoExistente = await this.repo.checkIfHas(dto);
    if (contratoExistente) {
      throw new BadRequestException('This contract already exists');
    }

    if (dto.contractTemplateId) {
      const response = await this.repo.create(dto);
      const urlPromise = await this.generateContract.execute(response.id, dto.content);
      const result = await this.repo.updateUrl(
        response.id,
        urlPromise.url,
      );

      const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
      result.contractUrl = tempUrl;
      return result;
    } else {
      const response = await this.repo.create(dto);
      const minioResponse = await this.minioService.uploadFile(
        file,
        ['pdf'],
        response.id + '_' + new Date().getTime() + '.pdf',
      );
      const result = await this.repo.updateUrl(
        response.id,
        minioResponse.fileName,
      );

      const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
      result.contractUrl = tempUrl;
      return result;
    }
  }
  update(id: string, dto: ContractDto): Promise<ContractResponse> {
    return this.repo.update(id, dto);
  }

  delete(contratoId: string): Promise<ContractResponse> {
    return this.repo.delete(contratoId);
  }

  listByTenant(tenantId: string) {
    return this.repo.listByTenant(tenantId);
  }

  listByProperty(propertyId: string) {
    return this.repo.listByProperty(propertyId);
  }
}
