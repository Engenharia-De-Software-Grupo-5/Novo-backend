import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { InvoiceTargetType } from '@prisma/client';

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  condominiumExists(id: string) {
    return this.prisma.condominiums.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  }

  propertyExists(id: string) {
    return this.prisma.properties.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  }

  create(data: {
    targetType: InvoiceTargetType | 'CONDOMINIUM' | 'PROPERTY';
    condominiumId: string | null;
    propertyId: string | null;
    objectName: string;
    originalName: string;
    mimeType: string;
    extension: string;
    size: number;
  }) {
    return this.prisma.invoices.create({ data: data as any });
  }

  listByCondominium(condominiumId: string) {
    return this.prisma.invoices.findMany({
      where: { condominiumId, deletedAt: null, targetType: 'CONDOMINIUM' },
      orderBy: { createdAt: 'desc' },
    });
  }

  listByProperty(propertyId: string) {
    return this.prisma.invoices.findMany({
      where: { propertyId, deletedAt: null, targetType: 'PROPERTY' },
      orderBy: { createdAt: 'desc' },
    });
  }

  findForCondominium(condominiumId: string, invoiceId: string) {
    return this.prisma.invoices.findFirst({
      where: { id: invoiceId, condominiumId, deletedAt: null, targetType: 'CONDOMINIUM' },
    });
  }

  findForProperty(propertyId: string, invoiceId: string) {
    return this.prisma.invoices.findFirst({
      where: { id: invoiceId, propertyId, deletedAt: null, targetType: 'PROPERTY' },
    });
  }

  softDelete(id: string) {
    return this.prisma.invoices.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}