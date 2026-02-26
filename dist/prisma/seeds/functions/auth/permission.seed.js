"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
async function seedPermissions(prisma) {
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
//# sourceMappingURL=permission.seed.js.map