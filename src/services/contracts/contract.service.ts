import { BadRequestException, Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Multer } from 'multer';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';

@Injectable()
export class ContractsService {
  private readonly allowedExtensions = ['pdf'];

  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly minio: MinioClientService,
  ) {}
  getAll(): Promise<ContractResponse[]> {
    return this.contractRepository.getAll();
  }
  getById(contratoId: string): Promise<ContractResponse> {
    return this.contractRepository.getById(contratoId);
  }

  async create(dto: ContractDto): Promise<ContractResponse> {
    const contratoExistente = await this.contractRepository.checkIfHas(dto);

    if (contratoExistente) {
      throw new BadRequestException('This contract already exists');
    }
    
    return this.contractRepository.create(dto);
  }
  update(id: string, dto: ContractDto): Promise<ContractResponse> {
    return this.contractRepository.update(id, dto);
  }

  delete(contratoId: string): Promise<ContractResponse> {
    return this.contractRepository.delete(contratoId);
  }

  async upload(file: Express.Multer.File) {
    // const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    // if (ext !== 'pdf') throw new UnsupportedMediaTypeException('Only PDF files are allowed.');

    // const objectName = `contracts/${randomUUID()}.pdf`;
    // const fileName  = await this.minio.uploadFile(file, this.allowedExtensions, objectName);

    // return this.contractRepository.create({
    //   objectName: fileName.fileName,
    //   originalName: file.originalname,
    //   mimeType: file.mimetype,
    //   extension: 'pdf',
    //   size: file.size,
    //   ownerId: '',
    //   propertyId: ''
    // })
    return null;
  }

  async getDownloadUrl(contractId: string) {
    // const contract = await this.contractRepository.getById(contractId);
    // if (!contract) throw new NotFoundException('Contract not found.');
    // const url = await this.minio.getFileUrl(contract.objectName);
    // return { url };
    return null;
  }

  listByTenant(tenantId: string) {
    return this.contractRepository.listByTenant(tenantId);
  }

  listByProperty(propertyId: string) {
    return this.contractRepository.listByProperty(propertyId);
  }
}
