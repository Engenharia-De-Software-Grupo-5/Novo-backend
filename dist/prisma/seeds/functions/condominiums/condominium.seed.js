"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCondominiums = seedCondominiums;
async function seedCondominiums(prisma) {
    const condominiumA = await prisma.condominiums.create({
        data: {
            name: 'Condominium A',
            description: 'Description for Condominium A',
            address: { create: {
                    street: '123 Main St',
                    city: 'CityA',
                    neighborhood: 'NeighborhoodA',
                    number: 123,
                    uf: 'UF',
                    zip: '12345-678',
                },
            },
        },
    });
    const condominiumB = await prisma.condominiums.create({
        data: {
            name: 'Condominium B',
            description: 'Description for Condominium B',
            address: { create: {
                    street: '123 Main St',
                    city: 'CityB',
                    neighborhood: 'NeighborhoodB',
                    number: 456,
                    uf: 'UF',
                    zip: '12345-6789',
                },
            },
        },
    });
    return { condominiumA, condominiumB };
}
//# sourceMappingURL=condominium.seed.js.map