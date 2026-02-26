import { Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractsRepository } from 'src/repositories/contracts/contract.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';

@Injectable()
export class ContractService {
  private readonly allowedExtensions = ['pdf'];

  constructor(
    private readonly minioService: MinioClientService,
    private readonly generateContract: GenerateContractService,
    private readonly contractRepository: ContractRepository,
  ) { }
  getAll(): Promise<ContractResponse[]> {
    return this.contractRepository.getAll();
  }

  listPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<ContractResponse>> {
    return this.repo.getPaginated(data);
  }
  
  list(tenantCpf?: string) {
    return this.repo.list({ tenantCpf });
  }
  async getById(contratoId: string): Promise<ContractResponse> {
    const result = await this.contractRepository.getById(contratoId);
    const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
    result.contractUrl = tempUrl;
    return result;
  }

  async create(
    dto: ContractDto,
    file?: Express.Multer.File,
  ): Promise<ContractResponse> {
    const contratoExistente = await this.contractRepository.checkIfHas(dto);
    if (contratoExistente) {
      throw new BadRequestException('This contract already exists');
    }

    if (dto.contractTemplateId) {
      const response = await this.contractRepository.create(dto);
      const urlPromise = await this.generateContract.execute(response.id, dto.content);
      const result = await this.contractRepository.updateUrl(
        response.id,
        urlPromise.url,
      );

      const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
      result.contractUrl = tempUrl;
      return result;
    } else {
      const response = await this.contractRepository.create(dto);
      const minioResponse = await this.minioService.uploadFile(
        file,
        ['pdf'],
        response.id + '_' + new Date().getTime() + '.pdf',
      );
      const result = await this.contractRepository.updateUrl(
        response.id,
        minioResponse.fileName,
      );

      const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
      result.contractUrl = tempUrl;
      return result;
    }
  }
  update(id: string, dto: ContractDto): Promise<ContractResponse> {
    return this.contractRepository.update(id, dto);
  }

  delete(contratoId: string): Promise<ContractResponse> {
    return this.contractRepository.delete(contratoId);
  }

  listByTenant(tenantId: string) {
    return this.contractRepository.listByTenant(tenantId);
  }

  listByProperty(propertyId: string) {
    return this.contractRepository.listByProperty(propertyId);
  }
}
