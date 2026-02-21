"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProperties = seedProperties;
async function seedProperties(prisma, condominiumId) {
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
//# sourceMappingURL=property.seed.js.map