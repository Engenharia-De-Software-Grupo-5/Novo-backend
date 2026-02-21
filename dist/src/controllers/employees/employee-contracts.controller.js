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
exports.EmployeeContractsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const employee_contracts_service_1 = require("../../services/employees/employee-contracts.service");
let EmployeeContractsController = class EmployeeContractsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async upload(employeeId, file) {
        if (!file)
            throw new common_1.BadRequestException('Envie um arquivo no campo "file".');
        return this.service.upload(employeeId, file);
    }
    async list(employeeId) {
        return this.service.list(employeeId);
    }
    async findOne(employeeId, contractId) {
        return this.service.findOne(employeeId, contractId);
    }
    async download(employeeId, contractId) {
        return this.service.getDownloadUrl(employeeId, contractId);
    }
    async remove(employeeId, contractId) {
        await this.service.remove(employeeId, contractId);
    }
};
exports.EmployeeContractsController = EmployeeContractsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload an employee contract (PDF only)',
        description: 'Upload a new PDF contract linked to an employee.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeeContractsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'List employee contracts',
        description: 'Retrieve a list of contracts linked to an employee.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeContractsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':contractId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get employee contract details',
        description: 'Retrieve details of a specific employee contract by its ID.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeeContractsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':contractId/download'),
    (0, swagger_1.ApiOperation)({
        summary: 'Download employee contract file',
        description: 'Get a temporary URL to download the employee contract PDF.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeeContractsController.prototype, "download", null);
__decorate([
    (0, common_1.Delete)(':contractId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete employee contract',
        description: 'Soft delete an employee contract by its ID.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeeContractsController.prototype, "remove", null);
exports.EmployeeContractsController = EmployeeContractsController = __decorate([
    (0, swagger_1.ApiTags)('Employee Contracts'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('employees/:employeeId/contracts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employee_contracts_service_1.EmployeeContractsService])
], EmployeeContractsController);
//# sourceMappingURL=employee-contracts.controller.js.map