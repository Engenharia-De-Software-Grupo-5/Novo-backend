import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { InvoiceRepository } from 'src/repositories/invoices/invoice.repository';

@Injectable()
export class CondominiumInvoiceService {
  private readonly allowed = ['jpg', 'jpeg', 'png', 'pdf'];

  constructor(
    private readonly repo: InvoiceRepository,
    private readonly minio: MinioClientService,
  ) {}

  async upload(condominiumId: string, file: Express.Multer.File) {
    const exists = await this.repo.condominiumExists(condominiumId);
    if (!exists) throw new NotFoundException('Condominium not found.');

    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    const objectName = `condominiums/${condominiumId}/invoices/${randomUUID()}.${ext}`;

    const { fileName } = await this.minio.uploadFile(file, this.allowed, objectName);

    return this.repo.create({
      targetType: 'CONDOMINIUM',
      condominiumId,
      propertyId: null,
      objectName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extension: ext,
      size: file.size,
    });
  }

  list(condominiumId: string) {
    return this.repo.listByCondominium(condominiumId);
  }

  async getDownloadUrl(condominiumId: string, invoiceId: string) {
    const inv = await this.repo.findForCondominium(condominiumId, invoiceId);
    if (!inv) throw new NotFoundException('Invoice not found.');

    return { url: await this.minio.getFileUrl(inv.objectName) };
  }

  async remove(condominiumId: string, invoiceId: string) {
    const inv = await this.repo.findForCondominium(condominiumId, invoiceId);
    if (!inv) throw new NotFoundException('Invoice not found.');

    try { await this.minio.deleteFile(inv.objectName); } catch {}
    await this.repo.softDelete(invoiceId);

    return { message: 'Invoice removed' };
  }

  async findOne(condominiumId: string, invoiceId: string) {
    const inv = await this.repo.findForCondominium(condominiumId, invoiceId);
    if (!inv) throw new NotFoundException('Invoice not found.');

    const url = await this.minio.getFileUrl(inv.objectName);
    return { ...inv, url };
  }
}
