import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { PropertyDocumentsRepository } from 'src/repositories/condominiums/property-documents.repository';

@Injectable()
export class PropertyDocumentsService {
  private readonly allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];

  constructor(
    private readonly repo: PropertyDocumentsRepository,
    private readonly minio: MinioClientService,
  ) {}

  async upload(condominiumId: string, propertyId: string, file: Express.Multer.File) {
    await this.repo.assertPropertyOwned(condominiumId, propertyId);

    const extension = (file.originalname.split('.').pop() || '').toLowerCase();
    const objectName = `condominiums/${condominiumId}/properties/${propertyId}/documents/${randomUUID()}.${extension}`;

    const { fileName } = await this.minio.uploadFile(file, this.allowedExtensions, objectName);

    return this.repo.create({
      condominiumId,
      propertyId,
      objectName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extension,
      size: file.size,
    });
  }

  list(condominiumId: string, propertyId: string) {
    return this.repo.list(condominiumId, propertyId);
  }

  async findOne(condominiumId: string, propertyId: string, documentId: string) {
    const doc = await this.repo.findOne(condominiumId, propertyId, documentId);
    const url = await this.minio.getFileUrl(doc.objectName);
    return { ...doc, url };
  }

  async getDownloadUrl(condominiumId: string, propertyId: string, documentId: string) {
    const doc = await this.repo.findOne(condominiumId, propertyId, documentId);
    const url = await this.minio.getFileUrl(doc.objectName);
    return { url };
  }

  async remove(condominiumId: string, propertyId: string, documentId: string) {
    const doc = await this.repo.findOne(condominiumId, propertyId, documentId);

    try {
      await this.minio.deleteFile(doc.objectName);
    } catch(error) {
      console.warn('Error deleting document file:', error);
    }

    await this.repo.softDelete(condominiumId, propertyId, documentId);
  }
}