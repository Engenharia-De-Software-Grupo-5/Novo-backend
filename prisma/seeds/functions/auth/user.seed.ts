import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(
  prisma: PrismaClient,
  permission1: string,
  permission2: string,
  condominiumIdA: string,
  condominiumIdB: string,
) {
  const password = await bcrypt.hash('12340', 10);

  const admin = await prisma.users.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      isAdminMaster: true,
      accesses: {
        create: [
          {
            condominiumsId: condominiumIdA,
            permissionsId: permission1,
            status: 'ACTIVE',
          },
          {
            condominiumsId: condominiumIdB,
            permissionsId: permission1,
            status: 'ACTIVE',
          },
        ],
      },
    },
  });

  const user = await prisma.users.create({
    data: {
      email: 'viniciusglaureano@gmail.com',
      name: 'Regular User',
      password,
      accesses: {
        create: [
          {
            condominiumsId: condominiumIdA,
            permissionsId: permission2,
            status: 'ACTIVE',
          },
          {
            condominiumsId: condominiumIdB,
            permissionsId: permission1,
            status: 'ACTIVE',
          },
        ],
      },
    },
  });

  return { admin, user };
}
