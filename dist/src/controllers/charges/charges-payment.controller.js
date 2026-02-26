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
exports.ChargePaymentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const charge_payments_service_1 = require("../../services/charges/charge-payments.service");
const create_payment_dto_1 = require("../../contracts/charges/payments/create-payment.dto");
const update_payment_dto_1 = require("../../contracts/charges/payments/update-payment.dto");
let ChargePaymentsController = class ChargePaymentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createPayment(chargeId, dto, file) {
        return this.service.create(chargeId, dto, file);
    }
    async list(chargeId) {
        return this.service.list(chargeId);
    }
    async findOne(chargeId, paymentId) {
        return this.service.findOne(chargeId, paymentId);
    }
    async downloadProof(chargeId, paymentId) {
        return this.service.getProofDownloadUrl(chargeId, paymentId);
    }
    async update(chargeId, paymentId, dto, file) {
        return this.service.update(chargeId, paymentId, dto, file);
    }
    async remove(chargeId, paymentId) {
        return this.service.remove(chargeId, paymentId);
    }
};
exports.ChargePaymentsController = ChargePaymentsController;
__decorate([
    (0, common_1.Post)(':chargeId/payments'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['amountPaid', 'paymentDate', 'method'],
            properties: {
                amountPaid: { type: 'number', example: 1000 },
                paymentDate: { type: 'string', example: '2026-02-18' },
                method: { type: 'string', enum: ['BOLETO', 'PIX', 'DEPOSIT'] },
                fineRate: { type: 'number', example: 0.02 },
                monthlyInterestRate: { type: 'number', example: 0.01 },
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('chargeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_payment_dto_1.CreateChargePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], ChargePaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)(':chargeId/payments'),
    (0, swagger_1.ApiOperation)({ summary: 'List payments of a charge' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('chargeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChargePaymentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':chargeId/payments/:paymentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment details' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('chargeId')),
    __param(1, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':chargeId/payments/:paymentId/proof/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Get proof download URL (presigned)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('chargeId')),
    __param(1, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePaymentsController.prototype, "downloadProof", null);
__decorate([
    (0, common_1.Patch)(':chargeId/payments/:paymentId'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                amountPaid: { type: 'number', example: 1000 },
                paymentDate: { type: 'string', example: '2026-02-18' },
                method: { type: 'string', enum: ['BOLETO', 'PIX', 'DEPOSIT'] },
                fineRate: { type: 'number', example: 0.02 },
                monthlyInterestRate: { type: 'number', example: 0.01 },
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('chargeId')),
    __param(1, (0, common_1.Param)('paymentId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_payment_dto_1.UpdateChargePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], ChargePaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':chargeId/payments/:paymentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove payment (soft delete)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('chargeId')),
    __param(1, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChargePaymentsController.prototype, "remove", null);
exports.ChargePaymentsController = ChargePaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Charges Payments'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('charges'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [charge_payments_service_1.ChargePaymentsService])
], ChargePaymentsController);
//# sourceMappingURL=charges-payment.controller.js.map