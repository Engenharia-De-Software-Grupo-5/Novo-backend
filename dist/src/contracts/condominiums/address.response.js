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
exports.AddressResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class AddressResponse {
    id;
    zip;
    street;
    neighborhood;
    city;
    uf;
    number;
    complement;
}
exports.AddressResponse = AddressResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adress ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], AddressResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Zip code',
        example: '12345-678',
    }),
    __metadata("design:type", String)
], AddressResponse.prototype, "zip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Street',
        example: 'Rua Exemplo',
    }),
    __metadata("design:type", String)
], AddressResponse.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Neighborhood',
        example: 'Prata',
    }),
    __metadata("design:type", String)
], AddressResponse.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City',
        example: 'São Paulo',
    }),
    __metadata("design:type", String)
], AddressResponse.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State',
        example: 'SP',
    }),
    __metadata("design:type", String)
], AddressResponse.prototype, "uf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number',
        example: 123,
    }),
    __metadata("design:type", Number)
], AddressResponse.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Complement',
        example: 'Apt 101',
    }),
    __metadata("design:type", String)
], AddressResponse.prototype, "complement", void 0);
//# sourceMappingURL=address.response.js.map