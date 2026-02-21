"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargesModule = void 0;
const common_1 = require("@nestjs/common");
;
const charge_payments_service_1 = require("../../services/charges/charge-payments.service");
const charge_payments_repository_1 = require("../../repositories/charges/charge-payments.repository");
const interest_calculator_service_1 = require("../../services/charges/interest-calculator.service");
const charges_payment_controller_1 = require("../../controllers/charges/charges-payment.controller");
const interest_calculator_controller_1 = require("../../controllers/charges/interest-calculator.controller");
const minio_client_module_1 = require("../tools/minio-client.module");
const charge_controller_1 = require("../../controllers/charges/charge.controller");
const charges_service_1 = require("../../services/charges/charges.service");
const charge_repository_1 = require("../../repositories/charges/charge.repository");
let ChargesModule = class ChargesModule {
};
exports.ChargesModule = ChargesModule;
exports.ChargesModule = ChargesModule = __decorate([
    (0, common_1.Module)({
        controllers: [charges_payment_controller_1.ChargePaymentsController, interest_calculator_controller_1.InterestCalculatorController, charge_controller_1.ChargesController],
        providers: [
            charge_payments_service_1.ChargePaymentsService,
            charge_payments_repository_1.ChargePaymentsRepository,
            interest_calculator_service_1.InterestCalculatorService,
            charges_service_1.ChargesService,
            charge_repository_1.ChargesRepository,
        ],
        imports: [minio_client_module_1.MinioClientModule],
        exports: [charge_payments_service_1.ChargePaymentsService],
    })
], ChargesModule);
//# sourceMappingURL=charge.module.js.map