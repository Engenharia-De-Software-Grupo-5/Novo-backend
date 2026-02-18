import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CondominiumInvoiceService } from 'src/services/invoices/condominium.invoice.service';

@ApiTags('Condominium Invoices')
@ApiBearerAuth('access-token')
@Controller('condominiums/:condominiumId/invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CondominiumInvoiceController {
  constructor(private readonly service: CondominiumInvoiceService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Upload an invoice for a condominium',
    description: 'Upload a new invoice file linked to a condominium.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('condominiumId') condominiumId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('Envie um arquivo no campo "file".');
    return this.service.upload(condominiumId, file);
  }

  @Get()
  @ApiOperation({
    summary: 'List condominium invoices',
    description: 'Retrieve a list of invoices linked to a condominium.',
  })
  @HttpCode(HttpStatus.OK)
  async list(@Param('condominiumId') condominiumId: string) {
    return this.service.list(condominiumId);
  }

  @Get(':invoiceId')
  @ApiOperation({
    summary: 'Get condominium invoice details',
    description:
      'Retrieve details of a specific condominium invoice by its ID.',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.service.findOne(condominiumId, invoiceId);
  }

  @Get(':invoiceId/download')
  @ApiOperation({
    summary: 'Download condominium invoice file',
    description: 'Get a temporary URL to download the condominium invoice file.',
  })
  @HttpCode(HttpStatus.OK)
  async download(
    @Param('condominiumId') condominiumId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.service.getDownloadUrl(condominiumId, invoiceId);
  }

  @Delete(':invoiceId')
  @ApiOperation({
    summary: 'Delete condominium invoice',
    description: 'Soft delete a condominium invoice by its ID.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('condominiumId') condominiumId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    await this.service.remove(condominiumId, invoiceId);
  }
}