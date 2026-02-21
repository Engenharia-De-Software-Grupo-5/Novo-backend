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
exports.ExpenseInvoiceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const expense_invoice_service_1 = require("../../services/expenses/expense-invoice.service");
let ExpenseInvoiceController = class ExpenseInvoiceController {
    service;
    constructor(service) {
        this.service = service;
    }
    async upload(expenseId, file) {
        if (!file)
            throw new common_1.BadRequestException('Envie um arquivo no campo "file".');
        return this.service.upload(expenseId, file);
    }
    list(expenseId) {
        return this.service.list(expenseId);
    }
    findOne(expenseId, invoiceId) {
        return this.service.findOne(expenseId, invoiceId);
    }
    download(expenseId, invoiceId) {
        return this.service.getDownloadUrl(expenseId, invoiceId);
    }
    async remove(expenseId, invoiceId) {
        await this.service.remove(expenseId, invoiceId);
    }
};
exports.ExpenseInvoiceController = ExpenseInvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Upload invoice for expense' }),
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
    __param(0, (0, common_1.Param)('expenseId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExpenseInvoiceController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'List invoices of expense' }),
    __param(0, (0, common_1.Param)('expenseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpenseInvoiceController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':invoiceId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice details' }),
    __param(0, (0, common_1.Param)('expenseId')),
    __param(1, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpenseInvoiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':invoiceId/download'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get download URL for invoice' }),
    __param(0, (0, common_1.Param)('expenseId')),
    __param(1, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpenseInvoiceController.prototype, "download", null);
__decorate([
    (0, common_1.Delete)(':invoiceId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete invoice (soft delete)' }),
    __param(0, (0, common_1.Param)('expenseId')),
    __param(1, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExpenseInvoiceController.prototype, "remove", null);
exports.ExpenseInvoiceController = ExpenseInvoiceController = __decorate([
    (0, swagger_1.ApiTags)('Expense Invoices'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('expenses/:expenseId/invoices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [expense_invoice_service_1.ExpenseInvoiceService])
], ExpenseInvoiceController);
//# sourceMappingURL=expense-invoice.controller.js.map