"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CondominiumModule = void 0;
const common_1 = require("@nestjs/common");
const condominium_controller_1 = require("../../controllers/condominiums/condominium.controller");
const condominium_repository_1 = require("../../repositories/condominiums/condominium.repository");
const condominium_service_1 = require("../../services/condominiums/condominium.service");
let CondominiumModule = class CondominiumModule {
};
exports.CondominiumModule = CondominiumModule;
exports.CondominiumModule = CondominiumModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [condominium_controller_1.CondominiumController],
        providers: [condominium_service_1.CondominiumService, condominium_repository_1.CondominiumRepository],
    })
], CondominiumModule);
//# sourceMappingURL=condominium.module.js.map