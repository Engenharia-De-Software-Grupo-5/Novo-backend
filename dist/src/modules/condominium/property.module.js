"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModule = void 0;
const common_1 = require("@nestjs/common");
const property_documents_controller_1 = require("../../controllers/condominiums/property-documents.controller");
const property_inspections_controller_1 = require("../../controllers/condominiums/property-inspections.controller");
const property_controller_1 = require("../../controllers/condominiums/property.controller");
const property_documents_repository_1 = require("../../repositories/condominiums/property-documents.repository");
const property_inspections_repository_1 = require("../../repositories/condominiums/property-inspections.repository");
const property_repository_1 = require("../../repositories/condominiums/property.repository");
const property_documents_repository_2 = require("../../services/condominiums/property-documents.repository");
const property_inspections_service_1 = require("../../services/condominiums/property-inspections.service");
const property_service_1 = require("../../services/condominiums/property.service");
const minio_client_module_1 = require("../tools/minio-client.module");
let PropertyModule = class PropertyModule {
};
exports.PropertyModule = PropertyModule;
exports.PropertyModule = PropertyModule = __decorate([
    (0, common_1.Module)({
        imports: [minio_client_module_1.MinioClientModule],
        controllers: [property_controller_1.PropertyController, property_documents_controller_1.PropertyDocumentsController, property_inspections_controller_1.PropertyInspectionsController],
        providers: [property_service_1.PropertyService, property_repository_1.PropertyRepository, property_documents_repository_1.PropertyDocumentsRepository, property_inspections_repository_1.PropertyInspectionsRepository, property_inspections_service_1.PropertyInspectionsService, property_documents_repository_2.PropertyDocumentsService],
    })
], PropertyModule);
//# sourceMappingURL=property.module.js.map