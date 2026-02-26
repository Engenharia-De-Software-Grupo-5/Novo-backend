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
exports.ContractTemplateRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let ContractTemplateRepository = class ContractTemplateRepository {
    prisma;
    async getPaginated(data) {
        const where = (0, prisma_utils_1.buildDynamicWhere)(data, { deletedAt: null }, {
            enumFields: ['status'],
            customMappings: {
                permissionName: (content) => ({
                    permission: { name: { contains: content, mode: 'insensitive' } },
                }),
            },
        });
        const [totalItems, items] = await this.prisma.$transaction([
            this.prisma.contractTemplates.count({
                where,
            }),
            this.prisma.contractTemplates.findMany({
                where,
                omit: {
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                },
                take: data.limit,
                skip: (data.page - 1) * data.limit,
                orderBy: { id: 'asc' },
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
    constructor(prisma) {
        this.prisma = prisma;
    }
    getById(contractTemplateId) {
        return this.prisma.contractTemplates.findUnique({
            where: { id: contractTemplateId, deletedAt: null },
            select: {
                id: true,
                name: true,
                description: true,
                template: true
            }
        });
    }
    getAll(name) {
        return this.prisma.contractTemplates.findMany({
            where: {
                deletedAt: null,
                ...(name && {
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    }
                })
            },
            select: {
                id: true,
                name: true,
                description: true,
                template: true
            }
        });
    }
    create(dto) {
        return this.prisma.contractTemplates.create({
            data: { name: dto.name, description: dto.description, template: dto.template },
            select: {
                id: true,
                name: true,
                description: true,
                template: true
            }
        });
    }
    update(contractTemplateId, dto) {
        return this.prisma.contractTemplates.update({
            where: { id: contractTemplateId },
            data: { name: dto.name, description: dto.description, template: dto.template },
            select: {
                id: true,
                name: true,
                description: true,
                template: true
            }
        });
    }
    delete(contractTemplateId) {
        return this.prisma.contractTemplates.update({
            where: { id: contractTemplateId },
            data: { deletedAt: new Date() }
        });
    }
};
exports.ContractTemplateRepository = ContractTemplateRepository;
exports.ContractTemplateRepository = ContractTemplateRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractTemplateRepository);
//# sourceMappingURL=contract.template.repository.js.map