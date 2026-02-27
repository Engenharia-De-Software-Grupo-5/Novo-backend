import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChargeStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateChargeDto } from 'src/contracts/charges/charge-update.dto';
import { ChargeDto } from 'src/contracts/charges/charge.dto';

import { ChargesService } from 'src/services/charges/charges.service';

@ApiTags('Charges')
@ApiBearerAuth('access-token')
@Controller('condominios/:condId/pagamentos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChargesController {
  constructor(private readonly service: ChargesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a charge' })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('condId') condominiumId: string,
    @Body() dto: ChargeDto) {
    return this.service.create(condominiumId, { ...dto, });
  }

  @Get()
  @ApiOperation({ summary: 'List charges' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ChargeStatus })
  @HttpCode(HttpStatus.OK)
  list(
    @Param('condId') condominiumId: string,
    @Query('tenantId') tenantId?: string,
    @Query('propertyId') propertyId?: string,
    @Query('status') status?: ChargeStatus,
  ) {
    return this.service.list({ condominiumId, tenantId, propertyId, status });
  }

  @Get(':chargeId')
  @ApiOperation({ summary: 'Get charge details' })
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string) {
    return this.service.findOne(condominiumId, chargeId);
  }

  @Patch(':chargeId')
  @ApiOperation({ summary: 'Update charge (status is automatic)' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string,
    @Body() dto: UpdateChargeDto) {
    return this.service.update(condominiumId, chargeId, dto);
  }

  @Patch(':chargeId/cancel')
  @ApiOperation({ summary: 'Cancel charge' })
  @HttpCode(HttpStatus.OK)
  cancel(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string) {
    return this.service.cancel(condominiumId, chargeId);
  }

  @Delete(':chargeId')
  @ApiOperation({ summary: 'Soft delete a charge' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string) {
    await this.service.remove(condominiumId, chargeId);
  }
}