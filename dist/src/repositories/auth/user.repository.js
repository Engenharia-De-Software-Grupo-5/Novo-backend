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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let UserRepository = class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll(condominiumId) {
        return this.prisma.users.findMany({
            where: {
                deletedAt: null,
                accesses: { some: { condominiumsId: condominiumId } },
            },
            include: {
                accesses: {
                    where: { deletedAt: null },
                    select: {
                        permission: { select: { id: true, name: true } },
                        condominium: { select: { id: true, name: true } },
                    },
                },
            },
            omit: { createdAt: true, updatedAt: true },
        });
    }
    getById(userId) {
        return this.prisma.users.findUnique({
            where: { id: userId, deletedAt: null },
            include: {
                accesses: {
                    where: { deletedAt: null },
                    select: {
                        permission: { select: { id: true, name: true } },
                        condominium: { select: { id: true, name: true } },
                    },
                },
            },
            omit: { createdAt: true, updatedAt: true },
        });
    }
    async getUserPaginated(data) {
        const where = (0, prisma_utils_1.buildDynamicWhere)(data, { deletedAt: null }, {
            enumFields: ['status'],
            customMappings: {
                permissionName: (content) => ({
                    permission: { name: { contains: content, mode: 'insensitive' } },
                }),
            },
        });
        const [totalItems, items] = await this.prisma.$transaction([
            this.prisma.users.count({
                where,
            }),
            this.prisma.users.findMany({
                where,
                include: {
                    accesses: {
                        where: { deletedAt: null },
                        select: {
                            permission: { select: { id: true, name: true } },
                            condominium: { select: { id: true, name: true } },
                        },
                    },
                },
                omit: { createdAt: true, updatedAt: true },
                take: data.limit,
                skip: (data.page - 1) * data.limit,
                orderBy: { name: 'asc' },
            }),
        ]);
        return {
            items,
            meta: {
                totalItems,
                totalPages: Math.ceil(totalItems / data.limit),
                page: data.page,
                limit: data.limit,
            },
        };
    }
    create(userDto, password, condominiumId) {
        return this.prisma.users.create({
            data: {
                name: userDto.name,
                email: userDto.email,
                password,
                accesses: {
                    create: {
                        condominium: { connect: { id: condominiumId } },
                        permission: { connect: { name: userDto.role } },
                        status: userDto.status,
                    },
                },
            },
            include: {
                accesses: {
                    select: {
                        permission: { select: { id: true, name: true } },
                        condominium: { select: { id: true, name: true } },
                    },
                },
            },
            omit: { createdAt: true, updatedAt: true },
        });
    }
    update(userId, userDto, condominiumId) {
        return this.prisma.users.update({
            where: { id: userId, deletedAt: null },
            data: {
                accesses: {
                    update: {
                        where: {
                            usersId_condominiumsId: {
                                usersId: userId,
                                condominiumsId: condominiumId,
                            },
                        },
                        data: {
                            deletedAt: null,
                            permission: { connect: { name: userDto.role } },
                            status: userDto.status,
                        },
                    },
                },
            },
            include: {
                accesses: {
                    select: {
                        permission: { select: { id: true, name: true } },
                        condominium: { select: { id: true, name: true } },
                    },
                },
            },
            omit: { createdAt: true, updatedAt: true },
        });
    }
    updatePassword(userId, password) {
        return this.prisma.users.update({
            where: { id: userId, deletedAt: null },
            data: { password },
            include: {
                accesses: {
                    where: { deletedAt: null },
                    select: {
                        permission: { select: { id: true, name: true } },
                        condominium: { select: { id: true, name: true } },
                    },
                },
            },
            omit: { createdAt: true, updatedAt: true },
        });
    }
    delete(userId, condominiumId) {
        return this.prisma.users.update({
            where: { id: userId, deletedAt: null },
            data: {
                accesses: {
                    update: {
                        where: {
                            usersId_condominiumsId: {
                                usersId: userId,
                                condominiumsId: condominiumId,
                            },
                        },
                        data: { deletedAt: new Date() },
                    },
                },
            },
            include: {
                accesses: {
                    select: {
                        permission: { select: { id: true, name: true } },
                        condominium: { select: { id: true, name: true } },
                    },
                },
            },
            omit: { createdAt: true, updatedAt: true },
        });
    }
    getByIdWithPassword(userId) {
        return this.prisma.users.findUnique({
            where: { id: userId, deletedAt: null },
            select: { password: true },
        });
    }
    findByEmail(email) {
        return this.prisma.users.findUnique({
            where: { email, deletedAt: null },
            include: {
                accesses: {
                    select: {
                        permission: { select: { id: true, name: true } },
                        condominium: { select: { id: true, name: true } },
                    },
                },
            },
            omit: { createdAt: true, updatedAt: true },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map