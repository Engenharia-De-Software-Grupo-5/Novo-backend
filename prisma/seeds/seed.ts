import { PrismaClient } from '@prisma/client';
import { seedUsers } from './functions/auth/user.seed';
import { seedPermissions } from './functions/auth/permission.seed';
import { seedContractTemplates } from './functions/auth/contract.template.seed';
import { seedCondominiums } from './functions/condominiums/condominium.seed';
import { seedProperties } from './functions/condominiums/property.seed';
import { seedEmployees } from './functions/employees/employee.seed';
import { seedTenants } from './functions/tenants/tenant.seed';

const prisma = new PrismaClient();

async function main() {
  const { permissionAdmin, permissionContractManager } =
    await seedPermissions(prisma);
  const { contractTemplate1, contractTemplate2 } =
    await seedContractTemplates(prisma);
  const { condominiumA, condominiumB } = await seedCondominiums(prisma);
  const { property1, property2 } = await seedProperties(
    prisma,
    condominiumA.id,
  );

  const { employee1, employee2 } = await seedEmployees(prisma);

  const { tenantA, tenantB } = await seedTenants(prisma);
  const { admin, user } = await seedUsers(
    prisma,
    permissionAdmin.id,
    permissionContractManager.id,
    condominiumA.id,
    condominiumB.id,
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
