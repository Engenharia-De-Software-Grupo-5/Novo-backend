"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTenants = seedTenants;
const client_1 = require("@prisma/client");
async function seedTenants(prisma) {
    const address = await prisma.addresses.findFirst();
    const condominium = await prisma.condominiums.findFirst();
    if (!address || !condominium) {
        throw new Error('You must seed addresses and condominiums before tenants.');
    }
    const tenantA = await prisma.tenants.create({
        data: {
            name: 'Tenant A',
            cpf: '17508074084',
            birthDate: new Date('1990-05-10'),
            maritalStatus: 'SINGLE',
            monthlyIncome: 5000,
            email: 'tenantA@email.com',
            primaryPhone: '+55 83 99999-0001',
            addressId: address.id,
            condominiumId: condominium.id,
            status: client_1.TenantStatus.ACTIVE,
        },
    });
    const tenantB = await prisma.tenants.create({
        data: {
            name: 'Tenant B',
            cpf: '12345678901',
            birthDate: new Date('1988-11-20'),
            maritalStatus: 'MARRIED',
            monthlyIncome: 7500,
            email: 'tenantB@email.com',
            primaryPhone: '+55 83 99999-0002',
            addressId: address.id,
            condominiumId: condominium.id,
            status: client_1.TenantStatus.ACTIVE,
        },
    });
    return { tenantA, tenantB };
}
//# sourceMappingURL=tenant.seed.js.map