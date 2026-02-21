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
exports.PropertyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class PropertyDto {
    identifier;
    address;
    unityNumber;
    unityType;
    block;
    floor;
    totalArea;
    propertySituation;
    observations;
}
exports.PropertyDto = PropertyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the property, such as a unit number or name (e.g., apartment 101, commercial room 202)',
        example: '101',
    }),
    __metadata("design:type", String)
], PropertyDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Additional address information for the property, such as proximity to landmarks or specific location details within the condominium',
        example: 'Próximo à casa X, Rua Y, etc.',
    }),
    __metadata("design:type", String)
], PropertyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Number or name of the property unit (e.g., apartment 101, commercial room 202)',
        example: '101',
    }),
    __metadata("design:type", String)
], PropertyDto.prototype, "unityNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(client_1.UnityType),
    (0, swagger_1.ApiProperty)({
        enum: client_1.UnityType,
        enumName: 'UnityType',
        example: client_1.UnityType.APARTMENT,
    }),
    __metadata("design:type", String)
], PropertyDto.prototype, "unityType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Obrigatory field for the block of the property, if applicable',
        example: 'bloco 1',
    }),
    __metadata("design:type", String)
], PropertyDto.prototype, "block", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Obrigatory field for the floor of the property, if applicable',
        example: 3,
    }),
    __metadata("design:type", Number)
], PropertyDto.prototype, "floor", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Numerical field for the total area of the property in square meters',
        example: 10,
    }),
    __metadata("design:type", Number)
], PropertyDto.prototype, "totalArea", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PropertySituation),
    (0, swagger_1.ApiProperty)({
        enum: client_1.PropertySituation,
        enumName: 'PropertySituation',
        example: client_1.PropertySituation.ACTIVE,
    }),
    __metadata("design:type", String)
], PropertyDto.prototype, "propertySituation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional field for any additional observations about the property',
        example: 'bloco 1',
    }),
    __metadata("design:type", String)
], PropertyDto.prototype, "observations", void 0);
//# sourceMappingURL=property.dto.js.map