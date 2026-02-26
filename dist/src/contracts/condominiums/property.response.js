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
exports.PropertyResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const condominium_response_1 = require("./condominium.response");
class PropertyResponse {
    id;
    identifier;
    address;
    unityNumber;
    unityType;
    block;
    floor;
    totalArea;
    propertySituation;
    observations;
    condominium;
}
exports.PropertyResponse = PropertyResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], PropertyResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property identifier',
        example: '123456789',
    }),
    __metadata("design:type", String)
], PropertyResponse.prototype, "identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property address',
        example: 'Monitas Street, 123',
    }),
    __metadata("design:type", String)
], PropertyResponse.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property unity number',
        example: '101',
    }),
    __metadata("design:type", String)
], PropertyResponse.prototype, "unityNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property unity type',
        example: 'APARTMENT',
    }),
    __metadata("design:type", String)
], PropertyResponse.prototype, "unityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Property block',
        example: 'A',
    }),
    __metadata("design:type", String)
], PropertyResponse.prototype, "block", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Property floor',
        example: 1,
    }),
    __metadata("design:type", Number)
], PropertyResponse.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Property total area',
        example: 100,
    }),
    __metadata("design:type", Number)
], PropertyResponse.prototype, "totalArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Property situation',
        example: 'ACTIVE',
    }),
    __metadata("design:type", String)
], PropertyResponse.prototype, "propertySituation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional observations about the property',
        example: 'This is a corner unit with great natural light.',
    }),
    __metadata("design:type", String)
], PropertyResponse.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional observations about the property',
        example: 'This is a corner unit with great natural light.',
    }),
    __metadata("design:type", condominium_response_1.CondominiumResponse)
], PropertyResponse.prototype, "condominium", void 0);
//# sourceMappingURL=property.response.js.map