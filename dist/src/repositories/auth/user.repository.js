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
    getAll() {
        return this.prisma.users.findMany({
            where: { deletedAt: null },
            include: {
                permission: { select: { id: true, name: true, functionalities: true } },
            },
            omit: {
                password: true,
                permissionsId: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
    }
    getById(userId) {
        return this.prisma.users.findUnique({
            where: { id: userId, deletedAt: null },
            include: {
                permission: { select: { id: true, name: true, functionalities: true } },
            },
            omit: {
                password: true,
                permissionsId: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
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
                    permission: {
                        select: { id: true, name: true, functionalities: true },
                    },
                },
                omit: {
                    password: true,
                    permissionsId: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                },
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
    create(userDto, password) {
        return this.prisma.users.upsert({
            where: { email: userDto.email },
            update: { ...userDto, password, deletedAt: null },
            create: { ...userDto, password },
            include: {
                permission: { select: { id: true, name: true, functionalities: true } },
            },
            omit: {
                password: true,
                permissionsId: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
    }
    update(userId, userDto) {
        return this.prisma.users.update({
            where: { id: userId, deletedAt: null },
            data: userDto,
            include: {
                permission: { select: { id: true, name: true, functionalities: true } },
            },
            omit: {
                password: true,
                permissionsId: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
    }
    updatePassword(userId, password) {
        return this.prisma.users.update({
            where: { id: userId, deletedAt: null },
            data: { password },
            include: {
                permission: { select: { id: true, name: true, functionalities: true } },
            },
            omit: {
                password: true,
                permissionsId: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
    }
    delete(userId) {
        return this.prisma.users.update({
            where: { id: userId, deletedAt: null },
            data: { deletedAt: new Date() },
            include: {
                permission: { select: { id: true, name: true, functionalities: true } },
            },
            omit: {
                password: true,
                permissionsId: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
    }
    getByIdWithPassword(userId) {
        return this.prisma.users.findUnique({
            where: { id: userId, deletedAt: null },
            select: { password: true },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map