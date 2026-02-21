import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ChargePaymentsRepository } from 'src/repositories/charges/charge-payments.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';
import { CreateChargePaymentDto } from 'src/contracts/charges/payments/create-payment.dto';
import { UpdateChargePaymentDto } from 'src/contracts/charges/payments/update-payment.dto';

@Injectable()
export class ChargePaymentsService {
  constructor(
    private readonly repo: ChargePaymentsRepository,
    private readonly minio: MinioClientService,
    private readonly calculator: InterestCalculatorService,
  ) {}

  private allowedProofExt = ['pdf', 'jpg', 'jpeg', 'png'];

  private ensureFile(file?: Express.Multer.File) {
    if (!file) return;
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!ext || !this.allowedProofExt.includes(ext)) {
      throw new UnsupportedMediaTypeException(
        `Tipo de arquivo inválido. Permitidos: ${this.allowedProofExt.join(', ')}`,
      );
    }
  }

  private compute(
  charge: { amount: number; dueDate: Date },
  dto: { amountPaid: number; paymentDate: string; fineRate?: number; monthlyInterestRate?: number },
) {
  const dueDate = charge.dueDate.toISOString().slice(0, 10);

  const calc = this.calculator.calculate({
    principal: charge.amount, 
    dueDate,
    referenceDate: dto.paymentDate,
    fineRate: dto.fineRate,
    monthlyInterestRate: dto.monthlyInterestRate,
  } as any);

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

  async create(chargeId: string, dto: CreateChargePaymentDto, file?: Express.Multer.File) {
    this.ensureFile(file);

    const charge = await this.repo.assertCharge(chargeId);

    const proof = file
      ? await this.minio.uploadFile(
          file,
          this.allowedProofExt,
          `payments/${chargeId}/${Date.now()}_${file.originalname}`,
        )
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
            objectName: proof!.fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            extension: ext ?? '',
            size: file.size,
          }
        : undefined,
    });

    return { id: created.id };
  }

  async list(chargeId: string) {
    await this.repo.assertCharge(chargeId);
    return this.repo.listPayments(chargeId);
  }

  async findOne(chargeId: string, paymentId: string) {
    await this.repo.assertCharge(chargeId);
    const p = await this.repo.getPayment(chargeId, paymentId);
    if (!p) throw new NotFoundException('Payment not found.');

    return p;
  }

  async getProofDownloadUrl(chargeId: string, paymentId: string) {
    const p = await this.findOne(chargeId, paymentId);
    if (!p.proofObjectName) throw new BadRequestException('Payment has no proof file.');

    const url = await this.minio.getFileUrl(p.proofObjectName);
    return { url };
  }

  async update(chargeId: string, paymentId: string, dto: UpdateChargePaymentDto, file?: Express.Multer.File) {
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

    const calc = this.compute(charge, merged as any);

    const proof = file
      ? await this.minio.uploadFile(
          file,
          this.allowedProofExt,
          `payments/${chargeId}/${Date.now()}_${file.originalname}`,
        )
      : null;

    const ext = file?.originalname.split('.').pop()?.toLowerCase();

    const { updated, previousProofObject } = await this.repo.updatePayment(chargeId, paymentId, {
      amountPaid: Number(merged.amountPaid),
      paymentDate: new Date(merged.paymentDate),
      method: merged.method,
      calc,
      proof: file
        ? {
            objectName: proof!.fileName,
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
      } catch {
      }
    }

    return { id: updated.id };
  }

  async remove(chargeId: string, paymentId: string) {

    const p = await this.findOne(chargeId, paymentId);

    const res = await this.repo.softDeletePayment(chargeId, paymentId);

    if (p.proofObjectName) {
      try {
        await this.minio.deleteFile(p.proofObjectName);
      } catch {
      }
    }

    return res;
  }
}