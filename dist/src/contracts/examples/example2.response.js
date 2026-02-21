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
exports.Example2Response = void 0;
const swagger_1 = require("@nestjs/swagger");
class Example2Response {
    campo1;
    campo2;
}
exports.Example2Response = Example2Response;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'descrição de exemplo para campo obrigatório',
        example: 'conteúdo de exemplo',
    }),
    __metadata("design:type", String)
], Example2Response.prototype, "campo1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'descrição de exemplo para campo não obrigatório',
        example: 'conteúdo de exemplo',
    }),
    __metadata("design:type", String)
], Example2Response.prototype, "campo2", void 0);
//# sourceMappingURL=example2.response.js.map