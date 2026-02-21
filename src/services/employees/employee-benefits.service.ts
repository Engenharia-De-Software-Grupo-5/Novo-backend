import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { EmployeeBenefitDto } from 'src/contracts/employees/employeeBenefit.dto';
import { EmployeeBenefitResponse } from 'src/contracts/employees/employeeBenefit.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';


@Injectable()
export class EmployeeBenefitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(employeeId: string, dto: EmployeeBenefitDto) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!employee) throw new NotFoundException('Employee not found.');

    if (!dto.value || Number.isNaN(dto.value) || dto.value <= 0) {
      throw new BadRequestException('Invalid value.');
    }

    return this.prisma.employeeBenefits.create({
      data: {
        employeeId,
        type: dto.type,
        referenceYear: dto.referenceYear,
        value: dto.value,
      },
    });
  }

  async listPaginated(
    employeeId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<EmployeeBenefitResponse>> {

    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });

    if (!employee) throw new NotFoundException('Employee not found.');

    const items = await this.prisma.employeeBenefits.findMany({
      where: { employeeId, deletedAt: null },
      orderBy: { referenceYear: 'desc' },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    return {
      items,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems: 0,
        totalPages: 0
      },
    };
  }

  async list(employeeId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!employee) throw new NotFoundException('Employee not found.');

    return this.prisma.employeeBenefits.findMany({
      where: { employeeId, deletedAt: null },
      orderBy: { referenceYear: 'desc' },
    });
  }

  async update(benefitId: string, employeeId: string, dto: EmployeeBenefitDto) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!employee) throw new NotFoundException('Funcionário não encontrado.');

    const existing = await this.prisma.employeeBenefits.findFirst({
      where: { id: benefitId, employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Registro não encontrado.');

    if (!dto.value || Number.isNaN(dto.value) || dto.value <= 0) {
      throw new BadRequestException('Valor inválido.');
    }

    return this.prisma.employeeBenefits.update({
      where: { id: benefitId },
      data: {
        type: dto.type,
        referenceYear: dto.referenceYear,
        value: dto.value,
      },
    });
  }

  async remove(benefitId: string, employeeId: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!employee) throw new NotFoundException('Employee not found.');

    const existing = await this.prisma.employeeBenefits.findFirst({
      where: { id: benefitId, employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Record not found.');

    await this.prisma.employeeBenefits.update({
      where: { id: benefitId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Record removed successfully.' };
  }
}