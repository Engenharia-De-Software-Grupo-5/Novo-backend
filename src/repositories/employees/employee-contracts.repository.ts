import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class EmployeeContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  employeeExists(id: string) {
    return this.prisma.employees.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
  }

  create(data: {
    employeeId: string;
    objectName: string;
    originalName: string;
    mimeType: string;
    extension: string;
    size: number;
  }) {
    return this.prisma.employeeContracts.create({ data });
  }

  listByEmployee(employeeId: string) {
    return this.prisma.employeeContracts.findMany({
      where: { employeeId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  findForEmployee(employeeId: string, contractId: string) {
    return this.prisma.employeeContracts.findFirst({
      where: { id: contractId, employeeId, deletedAt: null },
    });
  }

  softDelete(contractId: string) {
    return this.prisma.employeeContracts.update({
      where: { id: contractId },
      data: { deletedAt: new Date() },
    });
  }
}