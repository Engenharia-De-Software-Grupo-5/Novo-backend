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
exports.ChargePaymentsService = void 0;
const common_1 = require("@nestjs/common");
const charge_payments_repository_1 = require("../../repositories/charges/charge-payments.repository");
const minio_client_service_1 = require("../tools/minio-client.service");
const interest_calculator_service_1 = require("./interest-calculator.service");
let ChargePaymentsService = class ChargePaymentsService {
    repo;
    minio;
    calculator;
    constructor(repo, minio, calculator) {
        this.repo = repo;
        this.minio = minio;
        this.calculator = calculator;
    }
    allowedProofExt = ['pdf', 'jpg', 'jpeg', 'png'];
    ensureFile(file) {
        if (!file)
            return;
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (!ext || !this.allowedProofExt.includes(ext)) {
            throw new common_1.UnsupportedMediaTypeException(`Tipo de arquivo inválido. Permitidos: ${this.allowedProofExt.join(', ')}`);
        }
    }
    compute(charge, dto) {
        const dueDate = charge.dueDate.toISOString().slice(0, 10);
        const calc = this.calculator.calculate({
            principal: charge.amount,
            dueDate,
            referenceDate: dto.paymentDate,
            fineRate: dto.fineRate,
            monthlyInterestRate: dto.monthlyInterestRate,
        });
        return {
            wasLate: calc.daysLate > 0,
            daysLate: calc.daysLate,
            fineRate: calc.fineRate,
            monthlyRate: calc.monthlyInterestRate,
            finePaid: calc.fineValue,
            interestPaid: calc.interestValue,
            totalPaid: dto.amountPaid + calc.fineValue + calc.interestValue,
        };
    }
    async create(chargeId, dto, file) {
        this.ensureFile(file);
        const charge = await this.repo.assertCharge(chargeId);
        const proof = file
            ? await this.minio.uploadFile(file, this.allowedProofExt, `payments/${chargeId}/${Date.now()}_${file.originalname}`)
            : null;
        const ext = file?.originalname.split('.').pop()?.toLowerCase();
        const calc = this.compute(charge, dto);
        const created = await this.repo.createPayment(chargeId, {
            amountPaid: Number(dto.amountPaid),
            paymentDate: new Date(dto.paymentDate),
            method: dto.method,
            calc,
            proof: file
                ? {
                    objectName: proof.fileName,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    extension: ext ?? '',
                    size: file.size,
                }
                : undefined,
        });
        return { id: created.id };
    }
    async list(chargeId) {
        await this.repo.assertCharge(chargeId);
        return this.repo.listPayments(chargeId);
    }
    async findOne(chargeId, paymentId) {
        await this.repo.assertCharge(chargeId);
        const p = await this.repo.getPayment(chargeId, paymentId);
        if (!p)
            throw new common_1.NotFoundException('Payment not found.');
        return p;
    }
    async getProofDownloadUrl(chargeId, paymentId) {
        const p = await this.findOne(chargeId, paymentId);
        if (!p.proofObjectName)
            throw new common_1.BadRequestException('Payment has no proof file.');
        const url = await this.minio.getFileUrl(p.proofObjectName);
        return { url };
    }
    async update(chargeId, paymentId, dto, file) {
        this.ensureFile(file);
        const charge = await this.repo.assertCharge(chargeId);
        const prev = await this.repo.assertPayment(chargeId, paymentId);
        const merged = {
            amountPaid: dto.amountPaid ?? prev.amountPaid,
            paymentDate: dto.paymentDate ?? prev.paymentDate.toISOString().slice(0, 10),
            method: dto.method ?? prev.method,
            fineRate: dto.fineRate ?? prev.fineRate,
            monthlyInterestRate: dto.monthlyInterestRate ?? prev.monthlyRate,
        };
        const calc = this.compute(charge, merged);
        const proof = file
            ? await this.minio.uploadFile(file, this.allowedProofExt, `payments/${chargeId}/${Date.now()}_${file.originalname}`)
            : null;
        const ext = file?.originalname.split('.').pop()?.toLowerCase();
        const { updated, previousProofObject } = await this.repo.updatePayment(chargeId, paymentId, {
            amountPaid: Number(merged.amountPaid),
            paymentDate: new Date(merged.paymentDate),
            method: merged.method,
            calc,
            proof: file
                ? {
                    objectName: proof.fileName,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    extension: ext ?? '',
                    size: file.size,
                }
                : undefined,
        });
        if (file && previousProofObject) {
            try {
                await this.minio.deleteFile(previousProofObject);
            }
            catch {
            }
        }
        return { id: updated.id };
    }
    async remove(chargeId, paymentId) {
        const p = await this.findOne(chargeId, paymentId);
        const res = await this.repo.softDeletePayment(chargeId, paymentId);
        if (p.proofObjectName) {
            try {
                await this.minio.deleteFile(p.proofObjectName);
            }
            catch {
            }
        }
        return res;
    }
};
exports.ChargePaymentsService = ChargePaymentsService;
exports.ChargePaymentsService = ChargePaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [charge_payments_repository_1.ChargePaymentsRepository,
        minio_client_service_1.MinioClientService,
        interest_calculator_service_1.InterestCalculatorService])
], ChargePaymentsService);
//# sourceMappingURL=charge-payments.service.js.map