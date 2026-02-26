import { Injectable } from '@nestjs/common';
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
    role: true,
    contractType: true,
    admissionDate: true,
    baseSalary: true, 
    workload: true,      
    status: true,
  }

  async getPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<EmployeeResponse>> {
    const where = buildDynamicWhere(
      data,
      { deletedAt: null },
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

  // getAll, getById, create, update, delete
  getAll(): Promise<EmployeeResponse[]> {
    return this.prisma.employees.findMany({
      where: { deletedAt: null },
      select: this.employeeSelect,
    });
  }
  getById(employeeId: string): Promise<EmployeeResponse | null> {
    return this.prisma.employees.findUnique({
      where: { id: employeeId, deletedAt: null },
      select: this.employeeSelect,
    });
  }

  getByCpf(cpf: string): Promise<EmployeeResponse | null> {
    return this.prisma.employees.findUnique({
      where: { cpf, deletedAt: null},
      select: this.employeeSelect,
    });
  }

  async create(dto: EmployeeDto): Promise<EmployeeResponse> {
    const { bankData, ...rest } = dto;

    return this.prisma.employees.upsert({
      where: {
        cpf: dto.cpf,
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
        ...(bankData && {
          bankData: {
            create: { ...bankData },
          },
        }),
      },

      select: this.employeeSelect,
    });
  }

  update(id: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    const { bankData, ...rest } = dto;

    return this.prisma.employees.update({
      where: { id: id },
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

  updateByCpf(cpf: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    const { bankData, ...rest } = dto;
    
    return this.prisma.employees.update({
      where: { cpf },
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

  delete(employeeId: string): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { id: employeeId },
      data: { deletedAt: new Date() },
      select: this.employeeSelect,
    });
  }

  deleteByCpf(cpf: string): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { cpf },
      data: { deletedAt: new Date() },
      select: this.employeeSelect,
    });
  }
}
