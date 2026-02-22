import { Injectable } from '@nestjs/common';
import { ChargeStatus } from '@prisma/client';
import { UpdateChargeDto } from 'src/contracts/charges/charge-update.dto';
import { ChargeDto} from 'src/contracts/charges/charge.dto';
import { ChargesRepository } from 'src/repositories/charges/charge.repository';


@Injectable()
export class ChargesService {
  constructor(private readonly repo: ChargesRepository) {}

  create(dto: ChargeDto) {
    return this.repo.create(dto);
  }

  list(params?: { tenantId?: string; propertyId?: string; status?: ChargeStatus }) {
    return this.repo.list(params);
  }

  findOne(chargeId: string) {
    return this.repo.findOne(chargeId);
  }

  update(chargeId: string, dto: UpdateChargeDto) {
    return this.repo.update(chargeId, dto);
  }

  cancel(chargeId: string) {
    return this.repo.cancel(chargeId);
  }

  async remove(chargeId: string) {
    await this.repo.softDelete(chargeId);
    return { message: 'Charge removed successfully.' };
  }
}