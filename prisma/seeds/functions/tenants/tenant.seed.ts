import { PrismaClient } from '@prisma/client';

export async function seedTenants(
  prisma: PrismaClient,
) {

  const tenantA = await prisma.tenants.create({
    data: {
    name: 'Tenant A',
    cpf: '17508074084',
    },
  });

 const tenantB = await prisma.tenants.create({
    data: {
    name: 'Tenant B',
    cpf: '12345678901',
    },
  });
  return { tenantA, tenantB };
}