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
exports.AuthDataModel = exports.AccessData = exports.CondominiumSimpleResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const permission_response_1 = require("./permission.response");
class CondominiumSimpleResponse {
    id;
    name;
}
exports.CondominiumSimpleResponse = CondominiumSimpleResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission ID (UUID)',
        example: 'ad2d0c94-27d0-4562-8a2f-4c7e674d8b9d',
    }),
    __metadata("design:type", String)
], CondominiumSimpleResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission name',
        example: 'admin',
    }),
    __metadata("design:type", String)
], CondominiumSimpleResponse.prototype, "name", void 0);
class AccessData {
    permission;
    condominium;
}
exports.AccessData = AccessData;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'user permission',
        type: () => permission_response_1.PermissionResponse,
    }),
    __metadata("design:type", permission_response_1.PermissionResponse)
], AccessData.prototype, "permission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'user permission',
        type: () => CondominiumSimpleResponse,
    }),
    __metadata("design:type", CondominiumSimpleResponse)
], AccessData.prototype, "condominium", void 0);
class AuthDataModel {
    id;
    name;
    password;
    isAdminMaster;
    email;
    accesses;
}
exports.AuthDataModel = AuthDataModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID (UUID)',
        example: 'aeb123e3-f930-4a32-a3d3-bcd7355b6d90',
    }),
    __metadata("design:type", String)
], AuthDataModel.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of the user',
        example: 'João da Silva',
    }),
    __metadata("design:type", String)
], AuthDataModel.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password (hashed or raw, depending on context)',
        example: '12340',
    }),
    __metadata("design:type", String)
], AuthDataModel.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Define se o usuário é um administrador master',
        example: false,
    }),
    __metadata("design:type", Boolean)
], AuthDataModel.prototype, "isAdminMaster", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email',
        example: 'joao@example.com',
    }),
    __metadata("design:type", String)
], AuthDataModel.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'user accesses',
        type: () => AccessData,
    }),
    __metadata("design:type", Array)
], AuthDataModel.prototype, "accesses", void 0);
//# sourceMappingURL=auth-data.model.js.map