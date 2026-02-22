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
@Controller('charges')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChargesController {
  constructor(private readonly service: ChargesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a charge' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: ChargeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List charges' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ChargeStatus })
  @HttpCode(HttpStatus.OK)
  list(
    @Query('tenantId') tenantId?: string,
    @Query('propertyId') propertyId?: string,
    @Query('status') status?: ChargeStatus,
  ) {
    return this.service.list({ tenantId, propertyId, status });
  }

  @Get(':chargeId')
  @ApiOperation({ summary: 'Get charge details' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('chargeId') chargeId: string) {
    return this.service.findOne(chargeId);
  }

  @Patch(':chargeId')
  @ApiOperation({ summary: 'Update charge (status is automatic)' })
  @HttpCode(HttpStatus.OK)
  update(@Param('chargeId') chargeId: string, @Body() dto: UpdateChargeDto) {
    return this.service.update(chargeId, dto);
  }

  @Patch(':chargeId/cancel')
  @ApiOperation({ summary: 'Cancel charge' })
  @HttpCode(HttpStatus.OK)
  cancel(@Param('chargeId') chargeId: string) {
    return this.service.cancel(chargeId);
  }

  @Delete(':chargeId')
  @ApiOperation({ summary: 'Soft delete a charge' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('chargeId') chargeId: string) {
    await this.service.remove(chargeId);
  }
}