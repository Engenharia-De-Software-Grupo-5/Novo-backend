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
exports.TenantDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TenantDocumentDto {
    cpfFileId;
    incomeProofId;
}
exports.TenantDocumentDto = TenantDocumentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of the uploaded CPF file',
        example: 'a3f1b6c2-3f9d-4e7c-8c3f-123456789abc',
    }),
    __metadata("design:type", String)
], TenantDocumentDto.prototype, "cpfFileId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of the uploaded income proof file',
        example: 'b2f1c6a2-3f9d-4e7c-8c3f-987654321abc',
    }),
    __metadata("design:type", String)
], TenantDocumentDto.prototype, "incomeProofId", void 0);
//# sourceMappingURL=tenantDocument.dto.js.map