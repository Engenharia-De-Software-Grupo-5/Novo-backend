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
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const expense_repository_1 = require("../../repositories/expenses/expense.repository");
let ExpenseService = class ExpenseService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(dto) {
        return this.repo.create({
            ...dto,
            expenseDate: new Date(dto.expenseDate),
        });
    }
    list() {
        return this.repo.findAll();
    }
    listPaginated(data) {
        return this.repo.getPaginated(data);
    }
    findOne(id) {
        return this.repo.findByIdOrThrow(id);
    }
    update(id, dto) {
        return this.repo.update(id, {
            ...dto,
            expenseDate: new Date(dto.expenseDate),
        });
    }
    remove(id) {
        return this.repo.softDelete(id);
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [expense_repository_1.ExpenseRepository])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map