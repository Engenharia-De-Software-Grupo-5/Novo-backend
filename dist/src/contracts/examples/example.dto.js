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
exports.ExampleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const example2_dto_1 = require("./example2.dto");
class ExampleDto {
    campo1;
    campo2;
    campoNumerico;
    campoData;
    campoBoolean;
    simpleList;
    campoObjeto;
    campoObjetoArray;
}
exports.ExampleDto = ExampleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Descrição de exemplo para campo obrigatório',
        example: 'conteúdo de exemplo',
    }),
    __metadata("design:type", String)
], ExampleDto.prototype, "campo1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Descrição de exemplo para campo não obrigatório',
        example: 'conteúdo de exemplo',
    }),
    __metadata("design:type", String)
], ExampleDto.prototype, "campo2", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: 'Campo numérico',
        example: 10,
    }),
    __metadata("design:type", Number)
], ExampleDto.prototype, "campoNumerico", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: 'Campo data',
        example: '2025-02-03T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ExampleDto.prototype, "campoData", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        description: 'Campo boolean',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ExampleDto.prototype, "campoBoolean", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Lista de strings simples',
        example: ['item1', 'item2', 'item3'],
        isArray: true,
    }),
    __metadata("design:type", Array)
], ExampleDto.prototype, "simpleList", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => example2_dto_1.Example2Dto),
    (0, swagger_1.ApiProperty)({
        description: 'Campo que é outro objeto (validação aninhada)',
        type: () => example2_dto_1.Example2Dto,
    }),
    __metadata("design:type", example2_dto_1.Example2Dto)
], ExampleDto.prototype, "campoObjeto", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => example2_dto_1.Example2Dto),
    (0, swagger_1.ApiProperty)({
        description: 'Lista de outro objeto (validação aninhada em array)',
        type: () => example2_dto_1.Example2Dto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], ExampleDto.prototype, "campoObjetoArray", void 0);
//# sourceMappingURL=example.dto.js.map