"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseModule = void 0;
const common_1 = require("@nestjs/common");
const minio_client_module_1 = require("../tools/minio-client.module");
const expense_controller_1 = require("../../controllers/expenses/expense.controller");
const expense_invoice_controller_1 = require("../../controllers/expenses/expense-invoice.controller");
const expense_service_1 = require("../../services/expenses/expense.service");
const expense_invoice_service_1 = require("../../services/expenses/expense-invoice.service");
const expense_repository_1 = require("../../repositories/expenses/expense.repository");
const expense_invoice_repository_1 = require("../../repositories/expenses/expense-invoice.repository");
let ExpenseModule = class ExpenseModule {
};
exports.ExpenseModule = ExpenseModule;
exports.ExpenseModule = ExpenseModule = __decorate([
    (0, common_1.Module)({
        imports: [minio_client_module_1.MinioClientModule],
        controllers: [expense_controller_1.ExpenseController, expense_invoice_controller_1.ExpenseInvoiceController],
        providers: [
            expense_service_1.ExpenseService,
            expense_invoice_service_1.ExpenseInvoiceService,
            expense_repository_1.ExpenseRepository,
            expense_invoice_repository_1.ExpenseInvoiceRepository,
        ],
    })
], ExpenseModule);
//# sourceMappingURL=expense.module.js.map