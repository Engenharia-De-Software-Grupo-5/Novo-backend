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
exports.ContractResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class ContractResponse {
    id;
    objectName;
    originalName;
    mimeType;
    extension;
    size;
}
exports.ContractResponse = ContractResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID of the contract', example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], ContractResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Object name of the contract file', example: 'contracts/2023/09/15/123e4567-e89b-12d3-a456-426614174000.pdf' }),
    __metadata("design:type", String)
], ContractResponse.prototype, "objectName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original name of the contract file', example: 'contract.pdf' }),
    __metadata("design:type", String)
], ContractResponse.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MIME type of the contract file', example: 'application/pdf' }),
    __metadata("design:type", String)
], ContractResponse.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File extension of the contract', example: 'pdf' }),
    __metadata("design:type", String)
], ContractResponse.prototype, "extension", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Size of the contract file in bytes', example: 102400 }),
    __metadata("design:type", Number)
], ContractResponse.prototype, "size", void 0);
//# sourceMappingURL=contract.response.js.map