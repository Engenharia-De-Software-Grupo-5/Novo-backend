import { PrismaClient } from '@prisma/client';
import { seedUsers } from './functions/auth/user.seed';
import { seedPermissions } from './functions/auth/permission.seed';
import { seedContractTemplates } from './functions/auth/contract.template.seed';

const prisma = new PrismaClient();

async function main() {
  const { permissionAdmin, permissionContractManager } =
    await seedPermissions(prisma);
  const { admin, user } = await seedUsers(
    prisma,
    permissionAdmin.id,
    permissionContractManager.id,
  );
  const { contractTemplate1, contractTemplate2 } = await seedContractTemplates(prisma)
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
