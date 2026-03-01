import { PrismaClient, TenantStatus } from '@prisma/client';

export async function seedTenants(prisma: PrismaClient) {
  const address = await prisma.addresses.findFirst();
  const condominium = await prisma.condominiums.findFirst();

  if (!address || !condominium) {
    throw new Error('You must seed addresses and condominiums before tenants.');
  }

  const tenantA = await prisma.tenants.create({
    data: {
      name: 'Tenant A',
      cpf: '17508074084',
      rg: '123456789',
      issuingAuthority: 'SSP/PE',

      birthDate: '1995-03-15',
      maritalStatus: 'SINGLE',
      monthlyIncome: 5000,
      email: 'tenantA@email.com',
      primaryPhone: '+55 83 99999-0001',

      address: '123 Main St, Apt 4B, Cityville',
      condominiumId: condominium.id,

      status: TenantStatus.ACTIVE,
    },
  });

  const tenantB = await prisma.tenants.create({
    data: {
      name: 'Tenant B',
      cpf: '12345678901',
      rg: '123456788',
      issuingAuthority: 'SSP/PE',

      birthDate: '1990-01-01',
      maritalStatus: 'MARRIED',
      monthlyIncome: 7500,
      email: 'tenantB@email.com',
      primaryPhone: '+55 83 99999-0002',

      address: '123 Main St, Apt 4B, Cityville',
      condominiumId: condominium.id,

      status: TenantStatus.ACTIVE,
    },
  });

  return { tenantA, tenantB };
}
