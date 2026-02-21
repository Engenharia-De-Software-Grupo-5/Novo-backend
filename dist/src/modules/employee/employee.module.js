"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const common_1 = require("@nestjs/common");
const employee_benefits_controller_1 = require("../../controllers/employees/employee-benefits.controller");
const employee_payments_controller_1 = require("../../controllers/employees/employee-payments.controller");
const employee_controller_1 = require("../../controllers/employees/employee.controller");
const employee_benefits_repository_1 = require("../../repositories/employees/employee-benefits.repository");
const employee_payments_repository_1 = require("../../repositories/employees/employee-payments.repository");
const employee_repository_1 = require("../../repositories/employees/employee.repository");
const employee_benefits_service_1 = require("../../services/employees/employee-benefits.service");
const employee_payments_service_1 = require("../../services/employees/employee-payments.service");
const employee_service_1 = require("../../services/employees/employee.service");
const minio_client_module_1 = require("../tools/minio-client.module");
const employee_contracts_controller_1 = require("../../controllers/employees/employee-contracts.controller");
const employee_contracts_service_1 = require("../../services/employees/employee-contracts.service");
const employee_contracts_repository_1 = require("../../repositories/employees/employee-contracts.repository");
let EmployeeModule = class EmployeeModule {
};
exports.EmployeeModule = EmployeeModule;
exports.EmployeeModule = EmployeeModule = __decorate([
    (0, common_1.Module)({
        imports: [minio_client_module_1.MinioClientModule],
        controllers: [employee_controller_1.EmployeeController, employee_benefits_controller_1.EmployeeBenefitsController, employee_payments_controller_1.EmployeePaymentsController, employee_contracts_controller_1.EmployeeContractsController],
        providers: [employee_service_1.EmployeeService, employee_repository_1.EmployeeRepository, employee_benefits_service_1.EmployeeBenefitsService, employee_benefits_repository_1.EmployeeBenefitsRepository, employee_payments_service_1.EmployeePaymentsService, employee_payments_repository_1.EmployeePaymentsRepository, employee_contracts_service_1.EmployeeContractsService, employee_contracts_repository_1.EmployeeContractsRepository],
    })
], EmployeeModule);
//# sourceMappingURL=employee.module.js.map