import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { MinioClientService } from 'src/services/tools/minio-client.service';
import { ExpenseInvoiceRepository } from 'src/repositories/expenses/expense-invoice.repository';

@Injectable()
export class ExpenseInvoiceService {
  private readonly allowed = ['jpg', 'jpeg', 'png', 'pdf'];

  constructor(
    private readonly repo: ExpenseInvoiceRepository,
    private readonly minio: MinioClientService,
  ) {}

  async upload(expenseId: string, file: Express.Multer.File) {
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    const objectName = `expenses/${expenseId}/invoices/${randomUUID()}.${ext}`;

    const { fileName } = await this.minio.uploadFile(file, this.allowed, objectName);

    return this.repo.create({
      expenseId,
      objectName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  list(expenseId: string) {
    return this.repo.list(expenseId);
  }

  async findOne(expenseId: string, invoiceId: string) {
    const inv = await this.repo.findOneOrThrow(expenseId, invoiceId);
    const url = await this.minio.getFileUrl(inv.objectName);
    return { ...inv, url };
  }

  async getDownloadUrl(expenseId: string, invoiceId: string) {
    const inv = await this.repo.findOneOrThrow(expenseId, invoiceId);
    return { url: await this.minio.getFileUrl(inv.objectName) };
  }

  async remove(expenseId: string, invoiceId: string) {
    const inv = await this.repo.findOneOrThrow(expenseId, invoiceId);

    try {
      await this.minio.deleteFile(inv.objectName);
    } catch {}

    await this.repo.softDelete(expenseId, invoiceId);
  }
}