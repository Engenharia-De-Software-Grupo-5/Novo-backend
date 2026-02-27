import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ChargePaymentsService } from 'src/services/charges/charge-payments.service';
import { CreateChargePaymentDto } from 'src/contracts/charges/payments/create-payment.dto';
import { UpdateChargePaymentDto } from 'src/contracts/charges/payments/update-payment.dto';

@ApiTags('Charges Payments')
@ApiBearerAuth('access-token')
@Controller('condominios/:condId/pagamentos/')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChargePaymentsController {
  constructor(private readonly service: ChargePaymentsService) { }

  @Post(':chargeId/payments')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      required: ['amountPaid', 'paymentDate', 'method'],
      properties: {
        amountPaid: { type: 'number', example: 1000 },
        paymentDate: { type: 'string', example: '2026-02-18' },
        method: { type: 'string', enum: ['BOLETO', 'PIX', 'DEPOSIT'] },
        fineRate: { type: 'number', example: 0.02 },
        monthlyInterestRate: { type: 'number', example: 0.01 },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async createPayment(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string,
    @Body() dto: CreateChargePaymentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.create(condominiumId, chargeId, dto, file);
  }

  @Get(':chargeId/payments')
  @ApiOperation({ summary: 'List payments of a charge' })
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string) {
    return this.service.list(condominiumId, chargeId);
  }

  @Get(':chargeId/payments/:paymentId')
  @ApiOperation({ summary: 'Get payment details' })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.service.findOne(condominiumId, chargeId, paymentId);
  }

  @Get(':chargeId/payments/:paymentId/proof/download')
  @ApiOperation({ summary: 'Get proof download URL (presigned)' })
  @HttpCode(HttpStatus.OK)
  async downloadProof(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.service.getProofDownloadUrl(condominiumId, chargeId, paymentId);
  }

  @Patch(':chargeId/payments/:paymentId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amountPaid: { type: 'number', example: 1000 },
        paymentDate: { type: 'string', example: '2026-02-18' },
        method: { type: 'string', enum: ['BOLETO', 'PIX', 'DEPOSIT'] },
        fineRate: { type: 'number', example: 0.02 },
        monthlyInterestRate: { type: 'number', example: 0.01 },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string,
    @Param('paymentId') paymentId: string,
    @Body() dto: UpdateChargePaymentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.update(condominiumId, chargeId, paymentId, dto, file);
  }

  @Delete(':chargeId/payments/:paymentId')
  @ApiOperation({ summary: 'Remove payment (soft delete)' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('condId') condominiumId: string,
    @Param('chargeId') chargeId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.service.remove(condominiumId, chargeId, paymentId);
  }
}