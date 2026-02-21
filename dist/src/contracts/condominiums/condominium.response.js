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
exports.CondominiumResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const address_response_1 = require("./address.response");
const property_response_1 = require("./property.response");
class CondominiumResponse {
    id;
    name;
    description;
    address;
    properties;
}
exports.CondominiumResponse = CondominiumResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Condominium ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], CondominiumResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Condominium name',
        example: 'Benvenuto',
    }),
    __metadata("design:type", String)
], CondominiumResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Condominium description',
        example: 'Condominium classe A',
    }),
    __metadata("design:type", String)
], CondominiumResponse.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Condominium address',
        type: () => address_response_1.AddressResponse,
    }),
    __metadata("design:type", address_response_1.AddressResponse)
], CondominiumResponse.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of properties in the condominium',
        type: () => property_response_1.PropertyResponse,
        isArray: true,
    }),
    __metadata("design:type", Array)
], CondominiumResponse.prototype, "properties", void 0);
//# sourceMappingURL=condominium.response.js.map