import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class PropertyInspectionsRepository {
  constructor(private readonly prisma: PrismaService) {}


  async assertPropertyOwned(condominiumId: string, propertyId: string) {
    const property = await this.prisma.properties.findFirst({
      where: { id: propertyId, condominiumId, deletedAt: null },
      select: { id: true, condominiumId: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found.');
    }

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
   
    const { condominiumId: _condId, ...payload } = data;

    return this.prisma.propertyInspections.create({
      data: payload,
    });
  }

  async list(condominiumId: string, propertyId: string) {
    await this.assertPropertyOwned(condominiumId, propertyId);

    return this.prisma.propertyInspections.findMany({
      where: { propertyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }


  async findOne(condominiumId: string, propertyId: string, inspectionId: string) {
    await this.assertPropertyOwned(condominiumId, propertyId);

    const inspection = await this.prisma.propertyInspections.findFirst({
      where: {
        id: inspectionId,
        propertyId,
        deletedAt: null,
      },
    });

    if (!inspection) {
      throw new NotFoundException('Inspection not found.');
    }

    return inspection;
  }


  async softDelete(condominiumId: string, propertyId: string, inspectionId: string) {
  
    await this.findOne(condominiumId, propertyId, inspectionId);

    await this.prisma.propertyInspections.update({
      where: { id: inspectionId },
      data: { deletedAt: new Date() },
    });
  }
}