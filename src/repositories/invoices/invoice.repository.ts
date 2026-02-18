import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    objectName: string;
    originalName: string;
    mimeType: string;
    extension: string;
    size: number;
  }) {
    return this.prisma.invoices.create({ data });
  }

  list() {
    return this.prisma.invoices.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.invoices.findFirst({
      where: { id, deletedAt: null },
    });
  }

  softDelete(id: string) {
    return this.prisma.invoices.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}