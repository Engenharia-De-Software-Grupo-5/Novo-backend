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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeePaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const employeePayment_dto_1 = require("../../contracts/employees/employeePayment.dto");
const employeePayment_response_1 = require("../../contracts/employees/employeePayment.response");
const employee_payments_service_1 = require("../../services/employees/employee-payments.service");
let EmployeePaymentsController = class EmployeePaymentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(employeeId, dto) {
        return this.service.create(employeeId, dto);
    }
    async list(employeeId) {
        return this.service.list(employeeId);
    }
    async delete(employeeId, paymentId) {
        return this.service.delete(employeeId, paymentId);
    }
};
exports.EmployeePaymentsController = EmployeePaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign payment to employee',
        description: 'Create and assign a payment record to a specific employee.',
    }),
    (0, swagger_1.ApiBody)({ type: employeePayment_dto_1.EmployeePaymentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, type: employeePayment_response_1.EmployeePaymentResponse }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employeePayment_dto_1.EmployeePaymentDto]),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List employee payment history',
        description: 'Retrieve payment history for an employee.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: employeePayment_response_1.EmployeePaymentResponse, isArray: true }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)(':paymentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete employee payment',
        description: 'Soft delete a specific payment record for an employee.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee payment deleted successfully.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "delete", null);
exports.EmployeePaymentsController = EmployeePaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Employee Payments'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('employees/:employeeId/payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employee_payments_service_1.EmployeePaymentsService])
], EmployeePaymentsController);
//# sourceMappingURL=employee-payments.controller.js.map