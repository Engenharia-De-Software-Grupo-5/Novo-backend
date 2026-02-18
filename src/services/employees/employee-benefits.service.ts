import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { EmployeeBenefitDto } from 'src/contracts/employees/employeeBenefit.dto';
import { EmployeeBenefitResponse } from 'src/contracts/employees/employeeBenefit.response';

@Injectable()
export class EmployeeBenefitsService {
  constructor(private readonly prisma: PrismaService) {}

  async findEmployee(search: string) {
    return this.prisma.employees.findFirst({
      where: {
        deletedAt: null,
        OR: [
          { cpf: search },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      },
    });
  }

  async create(
    employeeId: string,
    dto: EmployeeBenefitDto,
  ): Promise<EmployeeBenefitResponse> {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
    });

    if (!employee) throw new NotFoundException('Employee not found.');

    if (dto.value <= 0)
      throw new BadRequestException('Invalid value.');

    const created = await this.prisma.employeeBenefits.create({
      data: {
        employeeId,
        type: dto.type,
        referenceYear: dto.referenceYear,
        value: dto.value,
      },
    });

    return created;
  }

  async list(employeeId: string): Promise<EmployeeBenefitResponse[]> {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
    });

    if (!employee) throw new NotFoundException('Employee not found.');

    return this.prisma.employeeBenefits.findMany({
      where: { employeeId, deletedAt: null },
      orderBy: { referenceYear: 'desc' },
    });
  }

  async update(
    id: string,
    employeeId: string,
    dto: EmployeeBenefitDto,
  ): Promise<EmployeeBenefitResponse> {
    const exists = await this.prisma.employeeBenefits.findFirst({
      where: { id, employeeId, deletedAt: null },
    });

    if (!exists) throw new NotFoundException('Record not found.');

    return this.prisma.employeeBenefits.update({
      where: { id },
      data: {
        type: dto.type,
        referenceYear: dto.referenceYear,
        value: dto.value,
      },
    });
  }

  async remove(id: string, employeeId: string) {
    const exists = await this.prisma.employeeBenefits.findFirst({
      where: { id, employeeId, deletedAt: null },
    });

    if (!exists) throw new NotFoundException('Record not found.');

    await this.prisma.employeeBenefits.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Record removed successfully.' };
  }
}