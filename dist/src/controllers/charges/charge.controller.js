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
exports.ChargesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const charge_update_dto_1 = require("../../contracts/charges/charge-update.dto");
const charge_dto_1 = require("../../contracts/charges/charge.dto");
const charges_service_1 = require("../../services/charges/charges.service");
let ChargesController = class ChargesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    list(tenantId, propertyId, status) {
        return this.service.list({ tenantId, propertyId, status });
    }
    findOne(chargeId) {
        return this.service.findOne(chargeId);
    }
    update(chargeId, dto) {
        return this.service.update(chargeId, dto);
    }
    cancel(chargeId) {
        return this.service.cancel(chargeId);
    }
    async remove(chargeId) {
        await this.service.remove(chargeId);
    }
};
exports.ChargesController = ChargesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a charge' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [charge_dto_1.ChargeDto]),
    __metadata("design:returntype", void 0)
], ChargesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List charges' }),
    (0, swagger_1.ApiQuery)({ name: 'tenantId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'propertyId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.ChargeStatus }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('propertyId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ChargesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':chargeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get charge details' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('chargeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChargesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':chargeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update charge (status is automatic)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('chargeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, charge_update_dto_1.UpdateChargeDto]),
    __metadata("design:returntype", void 0)
], ChargesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':chargeId/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel charge' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('chargeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChargesController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':chargeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a charge' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('chargeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChargesController.prototype, "remove", null);
exports.ChargesController = ChargesController = __decorate([
    (0, swagger_1.ApiTags)('Charges'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('charges'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [charges_service_1.ChargesService])
], ChargesController);
//# sourceMappingURL=charge.controller.js.map