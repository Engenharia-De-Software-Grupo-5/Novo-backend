import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class PropertyDocumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async assertPropertyOwned(condominiumId: string, propertyId: string) {
    const property = await this.prisma.properties.findFirst({
      where: { id: propertyId, condominiumId, deletedAt: null },
      select: { id: true, condominiumId: true },
    });

    if (!property) throw new NotFoundException('Property not found.');
    return property;
  }

  create(data: {
    condominiumId: string; 
    propertyId: string;
    objectName: string;
    originalName: string;
    mimeType: string;
    extension: string;
    size: number;
  }) {
    const payload = { ...data };
    delete payload.condominiumId;
    return this.prisma.propertyDocuments.create({ data: payload });
  }

  async list(condominiumId: string, propertyId: string) {
    await this.assertPropertyOwned(condominiumId, propertyId);

    return this.prisma.propertyDocuments.findMany({
      where: { propertyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(condominiumId: string, propertyId: string, documentId: string) {
    await this.assertPropertyOwned(condominiumId, propertyId);

    const doc = await this.prisma.propertyDocuments.findFirst({
      where: { id: documentId, propertyId, deletedAt: null },
    });

    if (!doc) throw new NotFoundException('Document not found.');
    return doc;
  }

  async softDelete(condominiumId: string, propertyId: string, documentId: string) {
    await this.findOne(condominiumId, propertyId, documentId);

    await this.prisma.propertyDocuments.update({
      where: { id: documentId },
      data: { deletedAt: new Date() },
    });
  }
}