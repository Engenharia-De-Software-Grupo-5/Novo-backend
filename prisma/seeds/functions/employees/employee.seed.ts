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
            status: 'ACTIVE',
            role: 'PORTEIRO',
            admissionDate: '2013-01-27',
            birthDate: '1990-01-01',
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
            status: 'ACTIVE',
            role: 'PORTEIRO',
            contractType: 'CLT',
            admissionDate: '2025-02-03',
            birthDate: '1990-01-01',
        },
    });
            
  return { employee1, employee2 };
}