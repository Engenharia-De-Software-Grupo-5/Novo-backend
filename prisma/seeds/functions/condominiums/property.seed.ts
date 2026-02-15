import { PrismaClient } from '@prisma/client';

export async function seedProperties(
  prisma: PrismaClient,
  condominiumId: string,
) {

    const property1 = await prisma.properties.create({
        data: { 
            identifier: '123456789',
            address: 'Monitas Street, 123',
            unityNumber: '101',
            condominiumId: condominiumId,
        },
    });

    const property2 = await prisma.properties.create({
        data: { 
            identifier: '987654321',
            address: 'Monitas Street, 456',
            unityNumber: '202',
            condominiumId: condominiumId,
        },
    });

  return { property1, property2 };
}