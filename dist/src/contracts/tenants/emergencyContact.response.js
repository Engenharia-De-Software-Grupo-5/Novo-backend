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
exports.EmergencyContactResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class EmergencyContactResponse {
    id;
    name;
    phone;
    relationship;
}
exports.EmergencyContactResponse = EmergencyContactResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency contact unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], EmergencyContactResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency contact full name',
        example: 'Ana Souza',
    }),
    __metadata("design:type", String)
], EmergencyContactResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency contact phone number',
        example: '+5511988887777',
    }),
    __metadata("design:type", String)
], EmergencyContactResponse.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency contact relationship to tenant',
        example: 'Sister',
    }),
    __metadata("design:type", String)
], EmergencyContactResponse.prototype, "relationship", void 0);
//# sourceMappingURL=emergencyContact.response.js.map