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
exports.InterestCalculatorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const interest_calculator_dto_1 = require("../../contracts/charges/calculator/interest-calculator.dto");
const interest_calculator_response_1 = require("../../contracts/charges/calculator/interest-calculator.response");
const interest_calculator_service_1 = require("../../services/charges/interest-calculator.service");
let InterestCalculatorController = class InterestCalculatorController {
    service;
    constructor(service) {
        this.service = service;
    }
    calculate(dto) {
        return this.service.calculate(dto);
    }
};
exports.InterestCalculatorController = InterestCalculatorController;
__decorate([
    (0, common_1.Post)('interest-calculator'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate fine and interest (juros e mora)',
        description: 'Calculates 2% fine (default) and 1% monthly interest (default, prorated by days/30) for overdue payments.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interest_calculator_dto_1.InterestCalculatorDto]),
    __metadata("design:returntype", interest_calculator_response_1.InterestCalculatorResponse)
], InterestCalculatorController.prototype, "calculate", null);
exports.InterestCalculatorController = InterestCalculatorController = __decorate([
    (0, swagger_1.ApiTags)('Charges'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('charges'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [interest_calculator_service_1.InterestCalculatorService])
], InterestCalculatorController);
//# sourceMappingURL=interest-calculator.controller.js.map