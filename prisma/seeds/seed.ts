import { PrismaClient } from '@prisma/client';
import { seedUsers } from './functions/auth/user.seed';
import { seedPermissions } from './functions/auth/permission.seed';

const prisma = new PrismaClient();

async function main() {
  const { permissionAdmin, permissionContractManager } =
    await seedPermissions(prisma);
  const { admin, user } = await seedUsers(
    prisma,
    permissionAdmin.id,
    permissionContractManager.id,
  );
}

main()
  .then(() => {
    console.log('Seed concluído com sucesso.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
