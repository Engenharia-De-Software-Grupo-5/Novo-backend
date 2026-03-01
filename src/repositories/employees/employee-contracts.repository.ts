import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class EmployeeContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  employeeExists(condId: string, id: string) {
    return this.prisma.employees.findFirst({
      where: { id, condId, deletedAt: null },
      select: { id: true },
    });
  }

  create(data: {
    condId: string;
    employeeId: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }) {
    return this.prisma.employeeContracts.create({ data });
  }

  listByEmployee(employeeId: string) {
    return this.prisma.employeeContracts.findMany({
      where: { employeeId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  findForEmployee(condId: string, employeeId: string, contractId: string) {
    return this.prisma.employeeContracts.findFirst({
      where: { id: contractId, employeeId, condId, deletedAt: null },
    });
  }

  softDelete(contractId: string) {
    return this.prisma.employeeContracts.update({
      where: { id: contractId },
      data: { deletedAt: new Date() },
    });
  }
}