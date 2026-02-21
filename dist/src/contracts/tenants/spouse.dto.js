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
exports.SpouseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_cpf_1 = require("class-validator-cpf");
const class_validator_1 = require("class-validator");
class SpouseDto {
    name;
    cpf;
    profession;
    monthlyIncome;
    birthDate;
}
exports.SpouseDto = SpouseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Spouse full name',
        example: 'João Pereira',
    }),
    __metadata("design:type", String)
], SpouseDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_cpf_1.IsCPF)(),
    (0, swagger_1.ApiProperty)({
        description: 'Spouse CPF (numbers only)',
        example: '17508074084',
    }),
    __metadata("design:type", String)
], SpouseDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Spouse profession',
        example: 'Doctor',
    }),
    __metadata("design:type", String)
], SpouseDto.prototype, "profession", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: 'Spouse monthly income',
        example: 8000,
    }),
    __metadata("design:type", Number)
], SpouseDto.prototype, "monthlyIncome", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: 'Spouse birth date',
        example: '1990-05-10T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], SpouseDto.prototype, "birthDate", void 0);
//# sourceMappingURL=spouse.dto.js.map