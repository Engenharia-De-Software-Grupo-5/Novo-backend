import { PrismaClient } from '@prisma/client';

export async function seedPermissions(prisma: PrismaClient) {
  const permissionAdmin = await prisma.permissions.create({
    data: {
      name: 'admin',
      functionalities: ['ALL'],
    },
  });

  const permissionContractManager = await prisma.permissions.create({
    data: {
      name: 'contractManager',
      functionalities: ['contractsGET', 'contractsPOST'],
    },
  });

  return { permissionAdmin, permissionContractManager };
}
