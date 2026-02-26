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
exports.ChargesService = void 0;
const common_1 = require("@nestjs/common");
const charge_repository_1 = require("../../repositories/charges/charge.repository");
let ChargesService = class ChargesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(dto) {
        return this.repo.create(dto);
    }
    listPaginated(data) {
        return this.repo.getPaginated(data);
    }
    list(params) {
        return this.repo.list(params);
    }
    findOne(chargeId) {
        return this.repo.findOne(chargeId);
    }
    update(chargeId, dto) {
        return this.repo.update(chargeId, dto);
    }
    cancel(chargeId) {
        return this.repo.cancel(chargeId);
    }
    async remove(chargeId) {
        await this.repo.softDelete(chargeId);
        return { message: 'Charge removed successfully.' };
    }
};
exports.ChargesService = ChargesService;
exports.ChargesService = ChargesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [charge_repository_1.ChargesRepository])
], ChargesService);
//# sourceMappingURL=charges.service.js.map