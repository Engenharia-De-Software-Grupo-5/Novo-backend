import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { AuthDataModel } from 'src/contracts/auth/auth-data.model';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  getUserByEmailOrCpf(userLogin: string): Promise<AuthDataModel | null> {
    return this.prisma.users.findFirst({
      where: {
        OR: [{ email: userLogin }, { cpf: userLogin }],
        deletedAt: null,
      },
      include: {
        accesses: {
          select: {
            permission: { select: { id: true, name: true } },
            condominium: { select: { id: true, name: true } },
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async getUserByEmail(email: string): Promise<string | undefined> {
    return (
      await this.prisma.users.findFirst({
        where: { email, deletedAt: null },
        select: { id: true },
      })
    )?.id;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.users.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }
}
