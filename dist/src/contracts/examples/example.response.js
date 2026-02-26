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
exports.ExampleResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const example2_response_1 = require("./example2.response");
class ExampleResponse {
    campo1;
    campo2;
    campoNumerico;
    campoData;
    campoBoolean;
    campoObjeto;
    campoObjetoArray;
    simpleList;
}
exports.ExampleResponse = ExampleResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'descrição de exemplo para campo obrigatório',
        example: 'conteúdo de exemplo',
    }),
    __metadata("design:type", String)
], ExampleResponse.prototype, "campo1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'descrição de exemplo para campo não obrigatório',
        example: 'conteúdo de exemplo',
    }),
    __metadata("design:type", String)
], ExampleResponse.prototype, "campo2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'campo numérico',
        example: 10,
    }),
    __metadata("design:type", Number)
], ExampleResponse.prototype, "campoNumerico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'campo data',
        example: '2025-02-03T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ExampleResponse.prototype, "campoData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'campo boolean',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ExampleResponse.prototype, "campoBoolean", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'campo que é outro objeto de response',
        type: () => example2_response_1.Example2Response,
    }),
    __metadata("design:type", example2_response_1.Example2Response)
], ExampleResponse.prototype, "campoObjeto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'lista de outro objeto de resposta',
        type: () => example2_response_1.Example2Response,
        isArray: true,
    }),
    __metadata("design:type", Array)
], ExampleResponse.prototype, "campoObjetoArray", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'lista de objeto simples',
        example: ['item1', 'item2', 'item3'],
        isArray: true,
    }),
    __metadata("design:type", Array)
], ExampleResponse.prototype, "simpleList", void 0);
//# sourceMappingURL=example.response.js.map