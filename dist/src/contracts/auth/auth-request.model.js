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
exports.AuthRequestModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const auth_data_model_1 = require("./auth-data.model");
class AuthRequestModel extends Request {
    user;
}
exports.AuthRequestModel = AuthRequestModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'An user like in database',
        example: '{\n"email": "user@example.com",\n"name": "John",\n"password": undefined}',
    }),
    __metadata("design:type", auth_data_model_1.AuthDataModel)
], AuthRequestModel.prototype, "user", void 0);
//# sourceMappingURL=auth-request.model.js.map