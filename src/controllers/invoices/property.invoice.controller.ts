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
import { PropertyInvoiceService } from 'src/services/invoices/property.invoice.service';

@ApiTags('Property Invoices')
@ApiBearerAuth('access-token')
@Controller('properties/:propertyId/invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertyInvoiceController {
  constructor(private readonly service: PropertyInvoiceService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Upload an invoice for a property',
    description: 'Upload a new invoice file linked to a property.',
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
    @Param('propertyId') propertyId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('Envie um arquivo no campo "file".');
    return this.service.upload(propertyId, file);
  }

  @Get()
  @ApiOperation({
    summary: 'List property invoices',
    description: 'Retrieve a list of invoices linked to a property.',
  })
  @HttpCode(HttpStatus.OK)
  async list(@Param('propertyId') propertyId: string) {
    return this.service.list(propertyId);
  }

  @Get(':invoiceId')
  @ApiOperation({
    summary: 'Get property invoice details',
    description: 'Retrieve details of a specific property invoice by its ID.',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('propertyId') propertyId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.service.findOne(propertyId, invoiceId);
  }

  @Get(':invoiceId/download')
  @ApiOperation({
    summary: 'Download property invoice file',
    description: 'Get a temporary URL to download the property invoice file.',
  })
  @HttpCode(HttpStatus.OK)
  async download(
    @Param('propertyId') propertyId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.service.getDownloadUrl(propertyId, invoiceId);
  }

  @Delete(':invoiceId')
  @ApiOperation({
    summary: 'Delete property invoice',
    description: 'Soft delete a property invoice by its ID.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('propertyId') propertyId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    await this.service.remove(propertyId, invoiceId);
  }
}