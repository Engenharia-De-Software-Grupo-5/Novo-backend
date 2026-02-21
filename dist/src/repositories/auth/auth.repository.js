"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let AuthRepository = class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getUserByEmailOrCpf(userLogin) {
        return this.prisma.users.findFirst({
            where: {
                OR: [{ email: userLogin }, { cpf: userLogin }],
                deletedAt: null,
            },
            include: {
                permission: { select: { id: true, name: true, functionalities: true } },
            },
            omit: { permissionsId: true, createdAt: true, updatedAt: true },
        });
    }
    async getUserByEmail(email) {
        return (await this.prisma.users.findFirst({
            where: { email, deletedAt: null },
            select: { id: true },
        }))?.id;
    }
    async updateUserPassword(id, hashedPassword) {
        await this.prisma.users.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map