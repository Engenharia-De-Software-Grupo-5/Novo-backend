import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { EmployeePaymentDto } from 'src/contracts/employees/employeePayment.dto';
import { EmployeePaymentResponse } from 'src/contracts/employees/employeePayment.response';


@Injectable()
export class EmployeePaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    employeeId: string,
    dto: EmployeePaymentDto,
  ): Promise<EmployeePaymentResponse> {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!employee) throw new NotFoundException('Employee not found.');

    if (!dto.value || Number.isNaN(dto.value) || dto.value <= 0) {
      throw new BadRequestException('Invalid payment value.');
    }


    const paymentDate = new Date(dto.paymentDate);
    if (Number.isNaN(paymentDate.getTime())) {
      throw new BadRequestException('Invalid payment date.');
    }

    if (paymentDate > new Date()) {
      throw new BadRequestException('Payment date cannot be in the future.');
    }

    const created = await this.prisma.employeePayments.create({
      data: {
        employeeId,
        value: dto.value,
        paymentDate,
        type: dto.type,
      },
      select: {
        id: true,
        value: true,
        paymentDate: true,
        type: true,
      },
    });

    return {
      id: created.id,
      value: created.value,
      paymentDate: created.paymentDate.toISOString().slice(0, 10), 
      type: created.type,
    };
  }

  async list(employeeId: string): Promise<EmployeePaymentResponse[]> {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!employee) throw new NotFoundException('Employee not found.');

    const rows = await this.prisma.employeePayments.findMany({
      where: { employeeId, deletedAt: null },
      orderBy: { paymentDate: 'desc' },
      select: {
        id: true,
        value: true,
        paymentDate: true,
        type: true,
      },
    });

    return rows.map((p) => ({
      id: p.id,
      value: p.value,
      paymentDate: p.paymentDate.toISOString().slice(0, 10),
      type: p.type,
    }));
  }

  async delete(employeeId: string, employeePaymentId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!employee) throw new NotFoundException('Employee not found.');

    const payment = await this.prisma.employeePayments.findFirst({
      where: { id: employeePaymentId, employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!payment) throw new NotFoundException('Employee payment not found.');

    await this.prisma.employeePayments.update({
      where: { id: employeePaymentId },
      data: { deletedAt: new Date() },
    });
  }
}