import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPatchDto } from 'src/contracts/auth/user.patch.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { buildDynamicWhere } from 'src/contracts/pagination/prisma.utils';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAll(condominiumId: string): Promise<UserResponse[]> {
    return this.prisma.users.findMany({
      where: {
        deletedAt: null,
        accesses: { some: { condominiumsId: condominiumId } },
      },
      include: {
        accesses: {
          where: { deletedAt: null },
          select: {
            permission: { select: { id: true, name: true } },
            condominium: { select: { id: true, name: true } },
            status: true,
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  getById(userId: string): Promise<UserResponse> {
    return this.prisma.users.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        accesses: {
          where: { deletedAt: null },
          select: {
            permission: { select: { id: true, name: true } },
            condominium: { select: { id: true, name: true } },
            status: true,
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
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
          accesses: {
            where: { deletedAt: null },
            select: {
              permission: { select: { id: true, name: true } },
              condominium: { select: { id: true, name: true } },
              status: true,
            },
          },
        },
        omit: { createdAt: true, updatedAt: true },
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

  create(
    userDto: UserDto,
    password: string,
    condominiumId: string,
  ): Promise<UserResponse> {
    return this.prisma.users.create({
      data: {
        name: userDto.name,
        email: userDto.email,
        password,
        accesses: {
          create: {
            condominium: { connect: { id: condominiumId } },
            permission: { connect: { name: userDto.role } },
            status: userDto.status,
          },
        },
      },
      include: {
        accesses: {
          select: {
            permission: { select: { id: true, name: true } },
            condominium: { select: { id: true, name: true } },
            status: true,
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  update(
    userId: string,
    userDto: UserPatchDto,
    condominiumId: string,
  ): Promise<UserResponse> {
    return this.prisma.users.update({
      where: { id: userId, deletedAt: null },
      data: {
        accesses: {
          update: {
            where: {
              usersId_condominiumsId: {
                usersId: userId,
                condominiumsId: condominiumId,
              },
            },
            data: {
              deletedAt: null,
              permission: { connect: { name: userDto.role } },
              status: userDto.status,
            },
          },
        },
      },
      include: {
        accesses: {
          select: {
            permission: { select: { id: true, name: true } },
            condominium: { select: { id: true, name: true } },
            status: true,
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  updatePassword(userId: string, password: string): Promise<UserResponse> {
    return this.prisma.users.update({
      where: { id: userId, deletedAt: null },
      data: { password },
      include: {
        accesses: {
          where: { deletedAt: null },
          select: {
            permission: { select: { id: true, name: true } },
            condominium: { select: { id: true, name: true } },
            status: true,
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  delete(userId: string, condominiumId: string): Promise<UserResponse> {
    return this.prisma.users.update({
      where: { id: userId, deletedAt: null },
      data: {
        accesses: {
          update: {
            where: {
              usersId_condominiumsId: {
                usersId: userId,
                condominiumsId: condominiumId,
              },
            },
            data: { deletedAt: new Date() },
          },
        },
      },
      include: {
        accesses: {
          select: {
            permission: { select: { id: true, name: true } },
            condominium: { select: { id: true, name: true } },
            status: true,
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  getByIdWithPassword(userId: string): Promise<{ password: string } | null> {
    return this.prisma.users.findUnique({
      where: { id: userId, deletedAt: null },
      select: { password: true },
    });
  }

  findByEmail(email: string): Promise<UserResponse> {
    return this.prisma.users.findUnique({
      where: { email, deletedAt: null },
      include: {
        accesses: {
          select: {
            permission: { select: { id: true, name: true } },
            condominium: { select: { id: true, name: true } },
            status: true,
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }
}
