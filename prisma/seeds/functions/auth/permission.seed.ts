import { PrismaClient } from '@prisma/client';

export async function seedPermissions(prisma: PrismaClient) {
  const permissionAdmin = await prisma.permissions.create({
    data: {
      name: 'Admin',
      functionalities: ['ALL'],
    },
  });

  const permissionFinanceiro = await prisma.permissions.create({
    data: {
      name: 'Financeiro',
      functionalities: ['contractsGET', 'contractsPOST'],
    },
  });

  const permissionRH = await prisma.permissions.create({
    data: {
      name: 'RH',
      functionalities: ['employeesGET', 'employeesPOST'],
    },
  });

  return { permissionAdmin, permissionFinanceiro, permissionRH };
}
