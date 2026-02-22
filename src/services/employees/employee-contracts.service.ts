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

  async upload(employeeId: string, file: Express.Multer.File) {

    const employee = await this.repo.employeeExists(employeeId);
    if (!employee) throw new NotFoundException('Employee not found.');

    const extension = (file.originalname.split('.').pop() || '').toLowerCase();
    if (extension !== 'pdf') {
      throw new UnsupportedMediaTypeException('Only PDF files are allowed.');
    }

    const objectName = `employees/${employeeId}/contracts/${randomUUID()}.pdf`;

    const { fileName } = await this.minio.uploadFile(file, this.allowedExtensions, objectName);

    return this.repo.create({
      employeeId,
      objectName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extension: 'pdf',
      size: file.size,
    });
  }

  async list(employeeId: string) {
    const employee = await this.repo.employeeExists(employeeId);
    if (!employee) throw new NotFoundException('Employee not found.');

    return this.repo.listByEmployee(employeeId);
  }

  async findOne(employeeId: string, contractId: string) {
    const contract = await this.repo.findForEmployee(employeeId, contractId);
    if (!contract) throw new NotFoundException('Contract not found.');

    const url = await this.minio.getFileUrl(contract.objectName);
    return { ...contract, url };
  }

  async getDownloadUrl(employeeId: string, contractId: string) {
    const contract = await this.repo.findForEmployee(employeeId, contractId);
    if (!contract) throw new NotFoundException('Contract not found.');

    const url = await this.minio.getFileUrl(contract.objectName);
    return { url };
  }

  async remove(employeeId: string, contractId: string) {
    const contract = await this.repo.findForEmployee(employeeId, contractId);
    if (!contract) throw new NotFoundException('Contract not found.');
    try {
      await this.minio.deleteFile(contract.objectName);
    } catch {
    }

    await this.repo.softDelete(contractId);
  }
}