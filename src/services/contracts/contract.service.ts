import { BadRequestException, Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { Multer } from 'multer';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';
import { GenerateContractService } from '../tools/generate-contract.service';
import { MinioClientService } from '../tools/minio-client.service';

@Injectable()
export class ContractService {
  private readonly allowedExtensions = ['pdf'];

  constructor(
    private readonly minioService: MinioClientService,
    private readonly generateContract: GenerateContractService,
    private readonly contractRepository: ContractRepository,
  ) {}
  getAll(): Promise<ContractResponse[]> {
    return this.contractRepository.getAll();
  }
  getById(contratoId: string): Promise<ContractResponse> {
    return this.contractRepository.getById(contratoId);
  }

  async create(dto: ContractDto, file?: Express.Multer.File): Promise<ContractResponse> {
    const contratoExistente = await this.contractRepository.checkIfHas(dto);
    if (contratoExistente) {
      throw new BadRequestException('This contract already exists');
    }

    if(dto.contractTemplateId){
      const response = await this.contractRepository.create(dto);
      const urlPromise = await this.generateContract.execute(response.id)
      return await this.contractRepository.updateUrl (response.id, urlPromise.url )
    }
    else{
      const response = await this.contractRepository.create(dto);      
      const minioResponse = await this.minioService.uploadFile(file, ['pdf'], 
        response.id + "_" + new Date().getTime() + ".pdf")
        return await this.contractRepository.updateUrl (response.id, minioResponse.fileName)
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
