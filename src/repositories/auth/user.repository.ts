import { Injectable } from '@nestjs/common';
import { permission } from 'process';
import { PrismaService } from 'src/common/database/prisma.service';
import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPasswordDto } from 'src/contracts/auth/user-password.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { buildDynamicWhere } from 'src/contracts/pagination/prisma.utils';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  getAll(): Promise<UserResponse[]> {
    return this.prisma.users.findMany({
      where: { deletedAt: null },
      include: {
        permission: { select: { id: true, name: true, functionalities: true } },
      },
      omit: {
        password: true,
        permissionsId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  getById(userId: string): Promise<UserResponse> {
    return this.prisma.users.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        permission: { select: { id: true, name: true, functionalities: true } },
      },
      omit: {
        password: true,
        permissionsId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async getUserPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<UserResponse>> {
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
      this.prisma.users.count({
        where,
      }),
      this.prisma.users.findMany({
        where,
        include: {
          permission: {
            select: { id: true, name: true, functionalities: true },
          },
        },
        omit: {
          password: true,
          permissionsId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        take: data.limit,
        skip: (data.page - 1) * data.limit,
        orderBy: { name: 'asc' },
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

  create(userDto: UserDto, password: string): Promise<UserResponse> {
    return this.prisma.users.upsert({
      where: { email: userDto.email },
      update: { ...userDto, password, deletedAt: null },
      create: { ...userDto, password },
      include: {
        permission: { select: { id: true, name: true, functionalities: true } },
      },
      omit: {
        password: true,
        permissionsId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  update(userId: string, userDto: UserDto): Promise<UserResponse> {
    return this.prisma.users.update({
      where: { id: userId, deletedAt: null },
      data: userDto,
      include: {
        permission: { select: { id: true, name: true, functionalities: true } },
      },
      omit: {
        password: true,
        permissionsId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  updatePassword(userId: string, password: string): Promise<UserResponse> {
    return this.prisma.users.update({
      where: { id: userId, deletedAt: null },
      data: { password },
      include: {
        permission: { select: { id: true, name: true, functionalities: true } },
      },
      omit: {
        password: true,
        permissionsId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  delete(userId: string): Promise<UserResponse> {
    return this.prisma.users.update({
      where: { id: userId, deletedAt: null },
      data: { deletedAt: new Date() },
      include: {
        permission: { select: { id: true, name: true, functionalities: true } },
      },
      omit: {
        password: true,
        permissionsId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  getByIdWithPassword(userId: string): Promise<{ password: string } | null> {
    return this.prisma.users.findUnique({
      where: { id: userId, deletedAt: null },
      select: { password: true },
    });
  }
}
