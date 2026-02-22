import { PrismaClient, TenantStatus } from '@prisma/client';

export async function seedTenants(
  prisma: PrismaClient,
) {

  const address = await prisma.addresses.findFirst();
  const condominium = await prisma.condominiums.findFirst();

  if (!address || !condominium) {
    throw new Error(
      'You must seed addresses and condominiums before tenants.',
    );
  }

  const tenantA = await prisma.tenants.create({
    data: {
      name: 'Tenant A',
      cpf: '17508074084',

      birthDate: new Date('1990-05-10'),
      maritalStatus: 'SINGLE',
      monthlyIncome: 5000,
      email: 'tenantA@email.com',
      primaryPhone: '+55 83 99999-0001',

      addressId: address.id,
      condominiumId: condominium.id,

      status: TenantStatus.ACTIVE,
    },
  });

  const tenantB = await prisma.tenants.create({
    data: {
      name: 'Tenant B',
      cpf: '12345678901',

      birthDate: new Date('1988-11-20'),
      maritalStatus: 'MARRIED',
      monthlyIncome: 7500,
      email: 'tenantB@email.com',
      primaryPhone: '+55 83 99999-0002',

      addressId: address.id,
      condominiumId: condominium.id,

      status: TenantStatus.ACTIVE,
    },
  });

  return { tenantA, tenantB };
}