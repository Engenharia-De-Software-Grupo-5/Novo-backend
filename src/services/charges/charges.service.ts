import { Injectable } from '@nestjs/common';
import { ChargeStatus } from '@prisma/client';
import { UpdateChargeDto } from 'src/contracts/charges/charge-update.dto';
import { ChargeDto } from 'src/contracts/charges/charge.dto';
import { PropertyResponse } from 'src/contracts/condominiums/property.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ChargesRepository } from 'src/repositories/charges/charge.repository';


@Injectable()
export class ChargesService {
  constructor(private readonly repo: ChargesRepository) { }

  create(condominiumId: string, dto: ChargeDto) {
    return this.repo.create(condominiumId, dto);
  }

  listPaginated(
    condominiumId: string,
    data: PaginationDto,
  ): Promise<PaginatedResult<PropertyResponse>> {
    return this.repo.getPaginated(condominiumId, data);
  }

  list(params?: { condominiumId?: string; tenantId?: string; propertyId?: string; status?: ChargeStatus }) {
    return this.repo.list(params);
  }

  findOne(condominiumId: string, chargeId: string) {
    return this.repo.findOne(condominiumId, chargeId);
  }

  update(condominiumId: string, chargeId: string, dto: UpdateChargeDto) {
    return this.repo.update(condominiumId, chargeId, dto);
  }

  cancel(condominiumId: string, chargeId: string) {
    return this.repo.cancel(condominiumId, chargeId);
  }

  async remove(condominiumId: string, chargeId: string) {
    await this.repo.softDelete(condominiumId, chargeId);
    return { message: 'Charge removed successfully.' };
  }
}