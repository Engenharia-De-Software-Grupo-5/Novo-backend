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
exports.AuthJwtResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const permission_response_1 = require("./permission.response");
const auth_data_model_1 = require("./auth-data.model");
let AuthJwtResponse = class AuthJwtResponse {
    id;
    email;
    name;
    isAdminMaster;
    permission;
    condominium;
};
exports.AuthJwtResponse = AuthJwtResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User id',
        example: '1',
    }),
    __metadata("design:type", String)
], AuthJwtResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email',
        example: 'user@example.com',
    }),
    __metadata("design:type", String)
], AuthJwtResponse.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User name',
        example: 'john123',
    }),
    __metadata("design:type", String)
], AuthJwtResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Define se o usuário é um administrador master',
        example: false,
    }),
    __metadata("design:type", Boolean)
], AuthJwtResponse.prototype, "isAdminMaster", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission name',
        type: [permission_response_1.PermissionResponse],
    }),
    __metadata("design:type", Array)
], AuthJwtResponse.prototype, "permission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission name',
        type: [auth_data_model_1.CondominiumSimpleResponse],
    }),
    __metadata("design:type", Array)
], AuthJwtResponse.prototype, "condominium", void 0);
exports.AuthJwtResponse = AuthJwtResponse = __decorate([
    (0, swagger_1.ApiSchema)()
], AuthJwtResponse);
//# sourceMappingURL=jwt.response.js.map