import { PrismaClient } from '@prisma/client';

export async function seedProperties(
  prisma: PrismaClient,
  condominiumId: string,
) {

    const property1 = await prisma.properties.create({
        data: { 
            name: 'Property 1',
            identifier: '123456789',
            propertyAddress: { create: 
                {
                    street: '123 Main St',
                    city: 'CityA',
                    neighborhood: 'NeighborhoodA',
                    number: 123,
                    uf: 'UF',
                    zip: '12345-678',

                },
            },
            unityNumber: '101',
            condominium: {connect: {id: condominiumId}},
        }
    });

    const property2 = await prisma.properties.create({
        data: {
            name: 'Property 2',
            identifier: '987654321',
            propertyAddress: { create: 
                {
                    street: '123 Main St',
                    city: 'CityA',
                    neighborhood: 'NeighborhoodA',
                    number: 123,
                    uf: 'UF',
                    zip: '12345-678',
                },
            },
            unityNumber: '202',
            condominium: {connect: {id: condominiumId}},
        },
    });

  return { property1, property2 };
}