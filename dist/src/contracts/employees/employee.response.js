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
exports.EmployeeResponse = void 0;
const client_1 = require("@prisma/client");
const bankData_response_1 = require("./bankData.response");
const swagger_1 = require("@nestjs/swagger");
class EmployeeResponse {
    id;
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
exports.EmployeeResponse = EmployeeResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], EmployeeResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee CPF',
        example: '123.456.789-00',
    }),
    __metadata("design:type", String)
], EmployeeResponse.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee name',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], EmployeeResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee bank data',
        type: bankData_response_1.BankDataResponse,
    }),
    __metadata("design:type", bankData_response_1.BankDataResponse)
], EmployeeResponse.prototype, "bankData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee role',
        example: 'Manager',
    }),
    __metadata("design:type", String)
], EmployeeResponse.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee contract type',
        example: client_1.ContractType.CLT,
    }),
    __metadata("design:type", String)
], EmployeeResponse.prototype, "contractType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee hire date',
        example: '2023-01-01',
    }),
    __metadata("design:type", Date)
], EmployeeResponse.prototype, "hireDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee base salary',
        example: 5000,
    }),
    __metadata("design:type", Number)
], EmployeeResponse.prototype, "baseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee workload',
        example: 40,
    }),
    __metadata("design:type", Number)
], EmployeeResponse.prototype, "workload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee status',
        example: client_1.EmployeeStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], EmployeeResponse.prototype, "status", void 0);
//# sourceMappingURL=employee.response.js.map