import { Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';


@Injectable()
export class EmployeeContractsService {
  private readonly allowedExtensions = ['pdf'];

  constructor(
    private readonly repo: EmployeeContractsRepository,
    private readonly minio: MinioClientService,
  ) {}

  async upload(condId: string, employeeId: string, file: Express.Multer.File) {

    const employee = await this.repo.employeeExists(condId, employeeId);
    if (!employee) throw new NotFoundException('Employee not found.');

    const extension = (file.originalname.split('.').pop() || '').toLowerCase();
    if (extension !== 'pdf') {
      throw new UnsupportedMediaTypeException('Only PDF files are allowed.');
    }

    const objectName = `employees/${employeeId}/contracts/${randomUUID()}.pdf`;

    const { fileName } = await this.minio.uploadFile(file, this.allowedExtensions, objectName);

    return this.repo.create({
      condId,
      employeeId,
      objectName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extension: 'pdf',
      size: file.size,
    });
  }

  async list(condId: string, employeeId: string) {
    const employee = await this.repo.employeeExists(condId, employeeId);
    if (!employee) throw new NotFoundException('Employee not found.');

    return this.repo.listByEmployee(employeeId);
  }

  async findOne(condId: string, employeeId: string, contractId: string) {
    const contract = await this.repo.findForEmployee(condId, employeeId, contractId);
    if (!contract) throw new NotFoundException('Contract not found.');

    const url = await this.minio.getFileUrl(contract.objectName);
    return { ...contract, url };
  }

  async getDownloadUrl(condId: string, employeeId: string, contractId: string) {
    const contract = await this.repo.findForEmployee(condId, employeeId, contractId);
    if (!contract) throw new NotFoundException('Contract not found.');

    const url = await this.minio.getFileUrl(contract.objectName);
    return { url };
  }

  async remove(condId: string, employeeId: string, contractId: string) {
    const contract = await this.repo.findForEmployee(condId, employeeId, contractId);
    if (!contract) throw new NotFoundException('Contract not found.');
    try {
      await this.minio.deleteFile(contract.objectName);
    } catch {
    }

    await this.repo.softDelete(contractId);
  }

  async updateEmployeeContracts(
    condId: string,
    employeeId: string,
    files: Express.Multer.File[] = [],
    existingIds: string[] = []
  ) {
    const currentContracts = await this.repo.listByEmployee(employeeId);

    const contractsToRemove = currentContracts.filter(c => !existingIds.includes(c.id));
    for (const c of contractsToRemove) {
      try { await this.minio.deleteFile(c.objectName); } catch {}
      await this.repo.softDelete(c.id);
    }

    const uploadedContracts = [];
    for (const file of files) {
      const uploaded = await this.upload(condId, employeeId, file);
      uploadedContracts.push({
        id: uploaded.id,
        name: uploaded.originalName,
        type: uploaded.mimeType,
        size: uploaded.size,
        url: await this.minio.getFileUrl(uploaded.objectName),
      });
    }

    const keptContracts = currentContracts.filter(c => existingIds.includes(c.id))
      .map(async c => ({
        id: c.id,
        name: c.originalName,
        type: c.mimeType,
        size: c.size,
        url: await this.minio.getFileUrl(c.objectName),
      }));

    return [...keptContracts, ...uploadedContracts];
  }
}