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
exports.CondominiumService = void 0;
const common_1 = require("@nestjs/common");
const condominium_repository_1 = require("../../repositories/condominiums/condominium.repository");
let CondominiumService = class CondominiumService {
    condominiumRepository;
    constructor(condominiumRepository) {
        this.condominiumRepository = condominiumRepository;
    }
    getAll() {
        return this.condominiumRepository.getAll();
    }
    getPaginated(data) {
        return this.condominiumRepository.getPaginated(data);
    }
    getById(condominiumId) {
        return this.condominiumRepository.getById(condominiumId);
    }
    async create(dto) {
        const condominioExistente = await this.condominiumRepository.getByName(dto.name);
        if (condominioExistente) {
            throw new common_1.BadRequestException('This condominium name already exists in the database.');
        }
        return this.condominiumRepository.create(dto);
    }
    update(id, dto) {
        return this.condominiumRepository.update(id, dto);
    }
    delete(condominiumId) {
        return this.condominiumRepository.delete(condominiumId);
    }
};
exports.CondominiumService = CondominiumService;
exports.CondominiumService = CondominiumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [condominium_repository_1.CondominiumRepository])
], CondominiumService);
//# sourceMappingURL=condominium.service.js.map