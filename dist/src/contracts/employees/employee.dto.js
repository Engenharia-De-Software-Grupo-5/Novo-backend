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
exports.EmployeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const bankData_dto_1 = require("./bankData.dto");
const class_validator_cpf_1 = require("class-validator-cpf");
class EmployeeDto {
    cpf;
    name;
    bankData;
    role;
    contractType;
    hireDate;
    baseSalary;
    workload;
    status;
}
exports.EmployeeDto = EmployeeDto;
__decorate([
    (0, class_validator_cpf_1.IsCPF)(),
    (0, swagger_1.ApiProperty)({
        description: "Obrigatory field for employee's cpf (just numbers)",
        example: '17508074084',
    }),
    __metadata("design:type", String)
], EmployeeDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Obrigatory field for employee's name",
        example: 'Oswaldo Fernades',
    }),
    __metadata("design:type", String)
], EmployeeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => bankData_dto_1.BankDataDto),
    (0, swagger_1.ApiProperty)({
        description: 'All of the bank data content',
        type: () => bankData_dto_1.BankDataDto,
    }),
    __metadata("design:type", bankData_dto_1.BankDataDto)
], EmployeeDto.prototype, "bankData", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Obrigatory field for employee's role",
        example: 'doorman',
    }),
    __metadata("design:type", String)
], EmployeeDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ContractType),
    (0, swagger_1.ApiProperty)({
        description: 'Obtigatory field for employee contract type',
        enum: client_1.ContractType,
        example: client_1.ContractType.CLT,
    }),
    __metadata("design:type", String)
], EmployeeDto.prototype, "contractType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: "Obrigatory field for employee's hiring date",
        example: '2013-01-27T04:59:32.000Z',
    }),
    __metadata("design:type", Date)
], EmployeeDto.prototype, "hireDate", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "Obrigatory field for employee's base salary",
        example: 1621,
    }),
    __metadata("design:type", Number)
], EmployeeDto.prototype, "baseSalary", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: "Obrigatory field for employee's workload in hours",
        example: 10,
    }),
    __metadata("design:type", Number)
], EmployeeDto.prototype, "workload", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.EmployeeStatus),
    (0, swagger_1.ApiProperty)({
        description: "Optional field for employee's current state (ACTIVE is the dafault option)",
        enum: client_1.EmployeeStatus,
        example: client_1.EmployeeStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], EmployeeDto.prototype, "status", void 0);
//# sourceMappingURL=employee.dto.js.map