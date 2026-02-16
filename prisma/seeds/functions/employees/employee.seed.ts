import { PrismaClient } from '@prisma/client';

export async function seedEmployees(
  prisma: PrismaClient,
) {

    const employee1 = await prisma.employees.create({
        data: { 
            cpf: '12312312312',
            name: 'Oswaldo Fernandes',
            bankData: { create: {
            },
            },
            role: 'doorman',
            contractType: 'CLT',
            hireDate: new Date('2025-02-03T00:00:00.000Z'),
            baseSalary: 10,
            workload: 40,
        },
    });

    const employee2 = await prisma.employees.create({
        data: { 
            cpf: '98765432100',
            name: 'Maria Silva',
            bankData: { create: {
            },
            },
            role: 'doorman',
            contractType: 'CLT',
            hireDate: new Date('2025-02-03T00:00:00.000Z'),
            baseSalary: 10,
            workload: 40,
        },
    });
            
  return { employee1, employee2 };
}