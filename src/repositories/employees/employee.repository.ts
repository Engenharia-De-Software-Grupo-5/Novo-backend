import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { buildDynamicWhere } from 'src/contracts/pagination/prisma.utils';

@Injectable()
export class EmployeeRepository {
  private readonly employeeSelect = {
    id: true,
    cpf: true,
    name: true,
    condominium: { select: { id: true, name: true } },
    email: true,
    phone: true,
    address: true,
    birthDate: true,
    bankData:{
      select: {
        id: true,
        bank: true,
        accountNumber: true,
        agency: true,
        accountType: true,
      }
    },
    employeeContracts: {
      where: { deletedAt: null },
      orderBy: { createdAt: Prisma.SortOrder.asc },
      select: {
        id: true,
        name: true,
        type: true,
        size: true,
        url: true,
      },
    },
    role: true,
    contractType: true,
    admissionDate: true,
    baseSalary: true, 
    workload: true,      
    status: true,
  }

  async getPaginated(
    condId: string,
    data: PaginationDto,
  ): Promise<PaginatedResult<EmployeeResponse>> {
    const where = buildDynamicWhere(
      data,
      { deletedAt: null, condId: condId },
      {
        enumFields: ['status'], 
        customMappings: {
          permissionName: (content) => ({
            permission: { name: { contains: content, mode: 'insensitive' } },
          }),
        },
      },
    );

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.employees.count({
        where,
      }),
      this.prisma.employees.findMany({
        where,
        select: this.employeeSelect,
        take: data.limit,
        skip: (data.page - 1) * data.limit,
        orderBy: { id: 'asc' },
      }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / data.limit),
        page: data.page,
        limit: data.limit,
      },
    };
  }

  constructor(private readonly prisma: PrismaService) {}

  getById(condId: string, employeeId: string): Promise<EmployeeResponse | null> {
    return this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null, condId: condId },
      select: this.employeeSelect,
    });
  }

  getByCpf(condId: string, cpf: string) {
    return this.prisma.employees.findFirst({
      where: { cpf: cpf, condId: condId, deletedAt: null },
      select: this.employeeSelect,
    });
  }

  async create(condId: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    const { bankData, ...rest } = dto;

    return this.prisma.employees.upsert({
      where: {
        cpf_condId: {
          cpf: dto.cpf,
          condId: condId,
        }
      },

      update: {
        ...rest,
        ...(bankData && {
          bankData: {
            upsert: {
              update: { ...bankData },
              create: { ...bankData },
            },
          },
        }),
        deletedAt: null,
      },

      create: {
        ...rest,
        condominium: { connect: { id: condId } },
        ...(bankData && {
          bankData: {
            create: { ...bankData },
          },
        }),
      },

      select: this.employeeSelect,
    });
  }

  update(condId: string, id: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    const { bankData, ...rest } = dto;

    return this.prisma.employees.update({
      where: { id: id, condId: condId },
      data: {
        ...rest,
        ...(bankData && {
          bankData: {
            upsert: {
              update: { ...bankData },
              create: { ...bankData }
            }
          }
        }),
        deletedAt: null
      },
      select: this.employeeSelect,
    });
  }

  delete(condId: string, employeeId: string): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { id: employeeId, condId: condId },
      data: { deletedAt: new Date() },
      select: this.employeeSelect,
    });
  }
}
