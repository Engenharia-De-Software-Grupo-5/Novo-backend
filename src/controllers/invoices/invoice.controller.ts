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
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { InvoiceService } from 'src/services/invoices/invoice.service';


@ApiTags('Invoices')
@ApiBearerAuth('access-token')
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  constructor(private readonly service: InvoiceService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: 'Upload an invoice',
      description: 'Upload a new invoice file to the system.',
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
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Envie um arquivo no campo "file".');
    return this.service.upload(file);
  }

  @Get()
    @ApiOperation({
      summary: 'List all invoices',
      description: 'Retrieve a list of all uploaded invoices.',
    })
    @HttpCode(HttpStatus.OK)

      async list() {
      return this.service.list();
  }


  @Get(':id')
    @ApiOperation({
      summary: 'Get invoice details',
      description: 'Retrieve details of a specific invoice by its ID.',
    })
    @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/download')
    @ApiOperation({
      summary: 'Download invoice file',
      description: 'Get a temporary URL to download the invoice file.',
    })
    @HttpCode(HttpStatus.OK)
  async download(@Param('id') id: string) {
    return this.service.getDownloadUrl(id);
  }

  @Delete(':id')
    @ApiOperation({
      summary: 'Delete an invoice',
      description: 'Soft delete an invoice by its ID.',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}