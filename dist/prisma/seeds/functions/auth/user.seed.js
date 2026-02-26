"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = seedUsers;
const bcrypt = require("bcrypt");
async function seedUsers(prisma, permission1, permission2, condominiumIdA, condominiumIdB) {
    const password = await bcrypt.hash('12340', 10);
    const admin = await prisma.users.create({
        data: {
            email: 'admin@example.com',
            name: 'Admin User',
            password,
            isAdminMaster: true,
            accesses: {
                create: [
                    {
                        condominiumsId: condominiumIdA,
                        permissionsId: permission1,
                        status: 'ACTIVE',
                    },
                    {
                        condominiumsId: condominiumIdB,
                        permissionsId: permission1,
                        status: 'ACTIVE',
                    },
                ],
            },
        },
    });
    const user = await prisma.users.create({
        data: {
            email: 'viniciusglaureano@gmail.com',
            name: 'Regular User',
            password,
            accesses: {
                create: [
                    {
                        condominiumsId: condominiumIdA,
                        permissionsId: permission2,
                        status: 'ACTIVE',
                    },
                    {
                        condominiumsId: condominiumIdB,
                        permissionsId: permission1,
                        status: 'ACTIVE',
                    },
                ],
            },
        },
    });
    return { admin, user };
}
//# sourceMappingURL=user.seed.js.map