import { Injectable, UnsupportedMediaTypeException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ContractsRepository } from 'src/repositories/contracts/contract.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';

@Injectable()
export class ContractsService {
  private readonly allowedExtensions = ['pdf'];

  constructor(
    private readonly repo: ContractsRepository,
    private readonly minio: MinioClientService,
  ) {}

  async upload(file: Express.Multer.File) {
    const extension = (file.originalname.split('.').pop() || '').toLowerCase();
    if (extension !== 'pdf') throw new UnsupportedMediaTypeException('Only PDF files are allowed.');

    const objectName = `contracts/${randomUUID()}.pdf`;
    const { fileName } = await this.minio.uploadFile(file, this.allowedExtensions, objectName);

    return this.repo.create({
      objectName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extension: 'pdf',
      size: file.size,
    });
  }

  list(tenantCpf?: string) {
    return this.repo.list({ tenantCpf });
  }

  async findOne(contractId: string) {
    const c = await this.repo.getById(contractId);
    if (!c) throw new NotFoundException('Contract not found.');
    const url = await this.minio.getFileUrl(c.objectName);
    return { ...c, url };
  }

  async getDownloadUrl(contractId: string) {
    const c = await this.repo.getById(contractId);
    if (!c) throw new NotFoundException('Contract not found.');
    const url = await this.minio.getFileUrl(c.objectName);
    return { url };
  }

  async remove(contractId: string) {
    const c = await this.repo.getById(contractId);
    if (!c) throw new NotFoundException('Contract not found.');

    try { await this.minio.deleteFile(c.objectName); } catch {}
    await this.repo.softDelete(contractId);
  }

  linkEmployee(contractId: string, employeeId: string) {
    return this.repo.linkEmployee(contractId, employeeId);
  }
  unlinkEmployee(contractId: string, employeeId: string) {
    return this.repo.unlinkEmployee(contractId, employeeId);
  }

  linkCondominium(contractId: string, condominiumId: string) {
    return this.repo.linkCondominium(contractId, condominiumId);
  }
  unlinkCondominium(contractId: string, condominiumId: string) {
    return this.repo.unlinkCondominium(contractId, condominiumId);
  }

  linkProperty(contractId: string, propertyId: string) {
    return this.repo.linkProperty(contractId, propertyId);
  }
  unlinkProperty(contractId: string, propertyId: string) {
    return this.repo.unlinkProperty(contractId, propertyId);
  }


  linkLease(contractId: string, propertyId: string, tenantId: string) {
    return this.repo.linkLease(contractId, propertyId, tenantId);
  }
  unlinkLease(contractId: string, propertyId: string, tenantId: string) {
    return this.repo.unlinkLease(contractId, propertyId, tenantId);
  }

  listByTenant(tenantId: string) {
    return this.repo.listByTenant(tenantId);
  }
  listByProperty(propertyId: string) {
    return this.repo.listByProperty(propertyId);
  }

  listByEmployee(employeeId: string) {
    return this.repo.listByEmployee(employeeId);
  }
  listByCondominium(condominiumId: string) {
    return this.repo.listByCondominium(condominiumId);
  }
}