import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InvoiceRepository } from 'src/repositories/invoices/invoice.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';


@Injectable()
export class InvoiceService {
  private readonly allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];

  constructor(
    private readonly repo: InvoiceRepository,
    private readonly minio: MinioClientService,
  ) {}

  async upload(file: Express.Multer.File) {
    const extension = (file.originalname.split('.').pop() || '').toLowerCase();


    const objectName = `invoices/${randomUUID()}.${extension}`;

    const { fileName } = await this.minio.uploadFile(
      file,
      this.allowedExtensions,
      objectName,
    );

    return this.repo.create({
      objectName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extension,
      size: file.size,
    });
  }

  async list() {
    return this.repo.list();
  }

  async findOne(id: string) {
    const invoice = await this.repo.findById(id);
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');
    return invoice;
  }

  async getDownloadUrl(id: string) {
    const invoice = await this.repo.findById(id);
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');

    const url = await this.minio.getFileUrl(invoice.objectName);
    return { url };
  }

  async remove(id: string) {
    const invoice = await this.repo.findById(id);
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');

    try {
      await this.minio.deleteFile(invoice.objectName);
    } catch {
    }

    await this.repo.softDelete(id);
    return { message: 'Nota fiscal removida com sucesso.' };
  }
}