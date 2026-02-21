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
exports.AuthPayload = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../common/decorators");
class AuthPayload {
    sub;
    email;
    cpf;
    name;
    permission;
    iat;
    exp;
}
exports.AuthPayload = AuthPayload;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        description: 'User id',
        example: 'c376f0d2-8eaa-4f88-9f2f-52f8dff8794a',
    }),
    __metadata("design:type", String)
], AuthPayload.prototype, "sub", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, decorators_1.SkipUppercase)(),
    (0, swagger_1.ApiProperty)({
        description: 'User email',
        example: 'user@example.com',
    }),
    __metadata("design:type", String)
], AuthPayload.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, decorators_1.SkipUppercase)(),
    (0, swagger_1.ApiProperty)({
        description: 'User cpf',
        example: '11111111111',
    }),
    __metadata("design:type", String)
], AuthPayload.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, decorators_1.SkipUppercase)(),
    (0, swagger_1.ApiProperty)({
        description: 'User name',
        example: 'john123',
    }),
    __metadata("design:type", String)
], AuthPayload.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, decorators_1.SkipUppercase)(),
    (0, swagger_1.ApiProperty)({
        description: 'Permission id',
        example: 'c376f0d2-8eaa-4f88-9f2f-52f8dff8794a',
    }),
    __metadata("design:type", String)
], AuthPayload.prototype, "permission", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'JWT issued at (timestamp)',
        example: 1700000000,
    }),
    __metadata("design:type", Number)
], AuthPayload.prototype, "iat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'JWT expiration (timestamp)',
        example: 1700003600,
    }),
    __metadata("design:type", Number)
], AuthPayload.prototype, "exp", void 0);
//# sourceMappingURL=auth-payload.model.js.map