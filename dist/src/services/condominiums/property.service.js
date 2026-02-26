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
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const property_repository_1 = require("../../repositories/condominiums/property.repository");
let PropertyService = class PropertyService {
    propertyRepository;
    constructor(propertyRepository) {
        this.propertyRepository = propertyRepository;
    }
    getAll(condominiumId) {
        return this.propertyRepository.getAll(condominiumId);
    }
    getPaginated(condominiumId, data) {
        return this.propertyRepository.getPaginated(condominiumId, data);
    }
    getById(condominiumId, propertyId) {
        return this.propertyRepository.getById(condominiumId, propertyId);
    }
    getByIdentificador(condominiumId, identificador) {
        return this.propertyRepository.getByIdentificador(condominiumId, identificador);
    }
    async create(condominiumId, dto) {
        const propertyExistente = await this.propertyRepository.getByIdentificador(condominiumId, dto.identifier);
        if (propertyExistente) {
            throw new common_1.ConflictException('Property with this identifier already exists in this condominium in the database.');
        }
        return this.propertyRepository.create(condominiumId, dto);
    }
    update(condominiumId, propertyId, dto) {
        return this.propertyRepository.update(condominiumId, propertyId, dto);
    }
    delete(condominiumId, propertyId) {
        return this.propertyRepository.delete(condominiumId, propertyId);
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [property_repository_1.PropertyRepository])
], PropertyService);
//# sourceMappingURL=property.service.js.map