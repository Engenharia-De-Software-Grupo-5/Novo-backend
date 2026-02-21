"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const user_seed_1 = require("./functions/auth/user.seed");
const permission_seed_1 = require("./functions/auth/permission.seed");
const contract_template_seed_1 = require("./functions/auth/contract.template.seed");
const condominium_seed_1 = require("./functions/condominiums/condominium.seed");
const property_seed_1 = require("./functions/condominiums/property.seed");
const employee_seed_1 = require("./functions/employees/employee.seed");
const tenant_seed_1 = require("./functions/tenants/tenant.seed");
const prisma = new client_1.PrismaClient();
async function main() {
    const { permissionAdmin, permissionContractManager } = await (0, permission_seed_1.seedPermissions)(prisma);
    const { admin, user } = await (0, user_seed_1.seedUsers)(prisma, permissionAdmin.id, permissionContractManager.id);
    const { contractTemplate1, contractTemplate2 } = await (0, contract_template_seed_1.seedContractTemplates)(prisma);
    const { condominiumA, condominiumB } = await (0, condominium_seed_1.seedCondominiums)(prisma);
    const { property1, property2 } = await (0, property_seed_1.seedProperties)(prisma, condominiumA.id);
    const { employee1, employee2 } = await (0, employee_seed_1.seedEmployees)(prisma);
    const { tenantA, tenantB } = await (0, tenant_seed_1.seedTenants)(prisma);
}
main()
    .then(() => {
    console.log('Seed concluído com sucesso.');
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map