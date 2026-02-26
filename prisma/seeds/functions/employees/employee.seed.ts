import { PrismaClient } from '@prisma/client';

export async function seedEmployees(
  prisma: PrismaClient,
) {

    const employee1 = await prisma.employees.create({
        data: { 
            cpf: '12312312312',
            name: 'Oswaldo Fernandes',
            condominium: { connect: { id: 'cond-123' } },
            bankData: { create: {
                bank: 'Banco do Brasil',
                accountNumber: '123412789',
                agency: '0002',
                accountType: 'Corrente',
            },
            },
            role: 'PORTEIRO',
            admissionDate: new Date('2025-02-03T00:00:00.000Z'),
            birthDate: new Date('1990-01-01T00:00:00.000Z'),
        },
    });

    const employee2 = await prisma.employees.create({
        data: { 
            cpf: '98765432100',
            name: 'Maria Silva',
            condominium: { connect: { id: 'cond-123' } },
            bankData: { create: {
                bank: 'Banco do Brasil',
                accountNumber: '123456789',
                agency: '0001',
                accountType: 'Corrente',
            },
            },
            role: 'PORTEIRO',
            contractType: 'CLT',
            admissionDate: new Date('2025-02-03T00:00:00.000Z'),
            birthDate: new Date('1990-01-01T00:00:00.000Z'),
        },
    });
            
  return { employee1, employee2 };
}