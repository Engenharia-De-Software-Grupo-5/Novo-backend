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
exports.ExpenseInvoiceService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const minio_client_service_1 = require("../tools/minio-client.service");
const expense_invoice_repository_1 = require("../../repositories/expenses/expense-invoice.repository");
let ExpenseInvoiceService = class ExpenseInvoiceService {
    repo;
    minio;
    allowed = ['jpg', 'jpeg', 'png', 'pdf'];
    constructor(repo, minio) {
        this.repo = repo;
        this.minio = minio;
    }
    async upload(expenseId, file) {
        const ext = (file.originalname.split('.').pop() || '').toLowerCase();
        const objectName = `expenses/${expenseId}/invoices/${(0, node_crypto_1.randomUUID)()}.${ext}`;
        const { fileName } = await this.minio.uploadFile(file, this.allowed, objectName);
        return this.repo.create({
            expenseId,
            objectName: fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            extension: ext,
            size: file.size,
        });
    }
    list(expenseId) {
        return this.repo.list(expenseId);
    }
    async findOne(expenseId, invoiceId) {
        const inv = await this.repo.findOneOrThrow(expenseId, invoiceId);
        const url = await this.minio.getFileUrl(inv.objectName);
        return { ...inv, url };
    }
    async getDownloadUrl(expenseId, invoiceId) {
        const inv = await this.repo.findOneOrThrow(expenseId, invoiceId);
        return { url: await this.minio.getFileUrl(inv.objectName) };
    }
    async remove(expenseId, invoiceId) {
        const inv = await this.repo.findOneOrThrow(expenseId, invoiceId);
        try {
            await this.minio.deleteFile(inv.objectName);
        }
        catch { }
        await this.repo.softDelete(expenseId, invoiceId);
    }
};
exports.ExpenseInvoiceService = ExpenseInvoiceService;
exports.ExpenseInvoiceService = ExpenseInvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [expense_invoice_repository_1.ExpenseInvoiceRepository,
        minio_client_service_1.MinioClientService])
], ExpenseInvoiceService);
//# sourceMappingURL=expense-invoice.service.js.map