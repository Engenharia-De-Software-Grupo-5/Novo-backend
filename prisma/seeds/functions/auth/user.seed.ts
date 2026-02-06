import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(
  prisma: PrismaClient,
  permission1: string,
  permission2: string,
) {
  const password = await bcrypt.hash('12340', 10);

  const admin = await prisma.users.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      cpf: '11111111111',
      password,
      permissionsId: permission1,
    },
  });

  const user = await prisma.users.create({
    data: {
      email: 'viniciusglaureano@gmail.com',
      name: 'Regular User',
      cpf: '22222222222',
      password,
      permissionsId: permission2,
    },
  });

  return { admin, user, password };
}
