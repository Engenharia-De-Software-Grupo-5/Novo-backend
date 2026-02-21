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
exports.PaginatedResult = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaginatedResult {
    static of(itemType) {
        const cls = PaginatedResult;
        cls.prototype.__itemType = itemType;
        return cls;
    }
    items;
    meta;
}
exports.PaginatedResult = PaginatedResult;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Informações sobre a paginação',
        type: 'object',
        properties: {
            totalItems: {
                type: 'number',
                description: 'Quantidade total de itens disponíveis',
            },
            totalPages: {
                type: 'number',
                description: 'Número total de páginas disponíveis',
            },
            page: {
                type: 'number',
                description: 'Número da página atual (1-based)',
            },
            limit: {
                type: 'number',
                description: 'Quantidade de itens por página (15-based)',
            },
        },
    }),
    __metadata("design:type", Object)
], PaginatedResult.prototype, "meta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de itens retornados na página atual',
        type: 'array',
        items: { oneOf: [{ $ref: (0, swagger_1.getSchemaPath)(Object) }] },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], PaginatedResult, "of", null);
//# sourceMappingURL=paginated.result.js.map