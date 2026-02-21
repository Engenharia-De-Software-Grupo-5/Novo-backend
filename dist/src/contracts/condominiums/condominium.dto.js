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
exports.CondominiumDto = void 0;
const class_validator_1 = require("class-validator");
const address_dto_1 = require("./address.dto");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CondominiumDto {
    name;
    description;
    address;
}
exports.CondominiumDto = CondominiumDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Obrigatory field for the name of the condominium',
        example: 'Bemvenuto',
    }),
    __metadata("design:type", String)
], CondominiumDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Obrigatory field for the description of the condominium',
        example: 'condominio classe A',
    }),
    __metadata("design:type", String)
], CondominiumDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => address_dto_1.AddressDto),
    (0, swagger_1.ApiProperty)({
        description: 'Obrigatory field for the address of the condominium',
        type: () => address_dto_1.AddressDto,
    }),
    __metadata("design:type", address_dto_1.AddressDto)
], CondominiumDto.prototype, "address", void 0);
//# sourceMappingURL=condominium.dto.js.map