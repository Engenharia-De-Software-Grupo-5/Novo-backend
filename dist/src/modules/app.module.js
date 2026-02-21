"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../services/app.service");
const app_controller_1 = require("../controllers/app.controller");
const core_1 = require("@nestjs/core");
const guards_1 = require("../common/guards");
const prisma_module_1 = require("./database/prisma.module");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const minio_client_module_1 = require("./tools/minio-client.module");
const contract_template_module_1 = require("./contract.templates/contract.template.module");
const employee_module_1 = require("./employee/employee.module");
const condominium_module_1 = require("./condominium/condominium.module");
const property_module_1 = require("./condominium/property.module");
const expense_module_1 = require("./expense/expense.module");
const contract_module_1 = require("./contract/contract.module");
const tenant_module_1 = require("./tenant/tenant.module");
const charge_module_1 = require("./charge/charge.module");
const user_module_1 = require("./auth/user.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaDatabaseModule,
            auth_module_1.AuthModule,
            minio_client_module_1.MinioClientModule,
            contract_template_module_1.ContractTemplateModule,
            condominium_module_1.CondominiumModule,
            employee_module_1.EmployeeModule,
            property_module_1.PropertyModule,
            expense_module_1.ExpenseModule,
            contract_module_1.ContractModule,
            tenant_module_1.TenantModule,
            charge_module_1.ChargesModule,
            user_module_1.UserModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map