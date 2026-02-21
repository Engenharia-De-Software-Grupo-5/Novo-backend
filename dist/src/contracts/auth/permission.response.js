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
exports.PermissionResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class PermissionResponse {
    id;
    name;
    functionalities;
}
exports.PermissionResponse = PermissionResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission ID (UUID)',
        example: 'ad2d0c94-27d0-4562-8a2f-4c7e674d8b9d',
    }),
    __metadata("design:type", String)
], PermissionResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission name',
        example: 'admin',
    }),
    __metadata("design:type", String)
], PermissionResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of screen identifiers this permission grants access to',
        example: ['contractsGET', 'contractsPOST'],
    }),
    __metadata("design:type", Array)
], PermissionResponse.prototype, "functionalities", void 0);
//# sourceMappingURL=permission.response.js.map