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
exports.BankingInfoResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class BankingInfoResponse {
    id;
    bank;
    accountNumber;
    agency;
    accountType;
}
exports.BankingInfoResponse = BankingInfoResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant banking info unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], BankingInfoResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant bank name',
        example: 'Banco do Brasil',
    }),
    __metadata("design:type", String)
], BankingInfoResponse.prototype, "bank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant bank account number',
        example: '12345678',
    }),
    __metadata("design:type", String)
], BankingInfoResponse.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant bank agency number',
        example: '1234',
    }),
    __metadata("design:type", String)
], BankingInfoResponse.prototype, "agency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant bank account type',
        example: 'Checking',
    }),
    __metadata("design:type", String)
], BankingInfoResponse.prototype, "accountType", void 0);
//# sourceMappingURL=bankingInfo.response.js.map