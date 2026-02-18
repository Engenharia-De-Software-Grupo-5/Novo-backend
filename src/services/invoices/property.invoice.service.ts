import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { InvoiceRepository } from "src/repositories/invoices/invoice.repository";
import { MinioClientService } from "../tools/minio-client.service";

@Injectable()
export class PropertyInvoiceService {
  private readonly allowed = ['jpg', 'jpeg', 'png', 'pdf'];

  constructor(
    private readonly repo: InvoiceRepository,
    private readonly minio: MinioClientService,
  ) {}

  async upload(propertyId: string, file: Express.Multer.File) {
    const exists = await this.repo.propertyExists(propertyId);
    if (!exists) throw new NotFoundException('Property not found.');

    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    const objectName = `properties/${propertyId}/invoices/${randomUUID()}.${ext}`;

    const { fileName } = await this.minio.uploadFile(file, this.allowed, objectName);

    return this.repo.create({
      targetType: 'PROPERTY',
      condominiumId: null,
      propertyId,
      objectName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extension: ext,
      size: file.size,
    });
  }

  list(propertyId: string) {
    return this.repo.listByProperty(propertyId);
  }

  async getDownloadUrl(propertyId: string, invoiceId: string) {
    const inv = await this.repo.findForProperty(propertyId, invoiceId);
    if (!inv) throw new NotFoundException('Invoice not found.');

    return { url: await this.minio.getFileUrl(inv.objectName) };
  }

  async remove(propertyId: string, invoiceId: string) {
    const inv = await this.repo.findForProperty(propertyId, invoiceId);
    if (!inv) throw new NotFoundException('Invoice not found.');

    try { await this.minio.deleteFile(inv.objectName); } catch {}
    await this.repo.softDelete(invoiceId);

    return { message: 'Invoice removed' };
  }

  async findOne(propertyId: string, invoiceId: string) {
    const inv = await this.repo.findForProperty(propertyId, invoiceId);
    if (!inv) throw new NotFoundException('Invoice not found.');

   
    const url = await this.minio.getFileUrl(inv.objectName);
    return { ...inv, url };
  }
}
