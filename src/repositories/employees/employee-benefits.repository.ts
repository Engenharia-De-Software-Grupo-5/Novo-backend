import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { BenefitType } from '@prisma/client';

@Injectable()
export class EmployeeBenefitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findEmployeeById(employeeId: string) {
    return this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
    });
  }

  create(data: {
    employeeId: string;
    type: BenefitType;
    referenceYear: number;
    value: number;
  }) {
    return this.prisma.employeeBenefits.create({ data });
  }

  findByEmployee(employeeId: string) {
    return this.prisma.employeeBenefits.findMany({
      where: { employeeId, deletedAt: null },
      orderBy: { referenceYear: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.employeeBenefits.findFirst({
      where: { id, deletedAt: null },
    });
  }

  update(id: string, data: any) {
    return this.prisma.employeeBenefits.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string) {
    return this.prisma.employeeBenefits.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}