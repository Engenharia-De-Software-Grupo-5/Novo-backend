import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { PaymentType } from '@prisma/client';

@Injectable()
export class EmployeePaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  employeeExists(employeeId: string) {
    return this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
  }

  create(data: {
    employeeId: string;
    value: number;
    paymentDate: Date;
    type: PaymentType;
  }) {
    return this.prisma.employeePayments.create({ data });
  }

  listByEmployee(employeeId: string) {
    return this.prisma.employeePayments.findMany({
      where: { employeeId, deletedAt: null },
      orderBy: { paymentDate: 'desc' },
    });
  }

  delete(employeeId: string, employeePaymentId: string) {
    return this.prisma.employeePayments.update({
      where: { id: employeePaymentId, employeeId },
      data: { deletedAt: new Date() },
    });
  }
}