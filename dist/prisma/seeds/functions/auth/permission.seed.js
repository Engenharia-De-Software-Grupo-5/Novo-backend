"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
async function seedPermissions(prisma) {
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
//# sourceMappingURL=permission.seed.js.map