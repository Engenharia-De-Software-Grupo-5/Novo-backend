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
exports.AddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class AddressDto {
    zip;
    street;
    neighborhood;
    city;
    uf;
    number;
    complement;
}
exports.AddressDto = AddressDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Obrigatory field for the zip code of the address',
        example: '123123',
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "zip", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Obrigatory field for the street of the address',
        example: 'Bemvenuto',
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Obrigatory field for the neighborhood of the address',
        example: 'Bemvenuto',
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "neighborhood", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Obrigatory field for the city of the address',
        example: 'Bemvenuto',
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Obrigatory field for the state of the address',
        example: 'SP',
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "uf", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: 'Obrigatory field for the number of the address',
        example: 10,
    }),
    __metadata("design:type", Number)
], AddressDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Opcional field for the complement of the address',
        example: 'Bemvenuto',
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "complement", void 0);
//# sourceMappingURL=address.dto.js.map