import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { PropertyDocumentsService } from 'src/services/condominiums/property-documents.repository';


@ApiTags('Property Documents')
@ApiBearerAuth('access-token')
@Controller('condominiums/:condominiumId/properties/:propertyId/documents')
export class PropertyDocumentsController {
  constructor(private readonly service: PropertyDocumentsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Upload a property document',
    description: 'Upload a new document linked to a property.',
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
    @Param('propertyId') propertyId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Envie um arquivo no campo "file".');
    return this.service.upload(condominiumId, propertyId, file);
  }

  @Get()
  @ApiOperation({ summary: 'List property documents' })
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('condominiumId') condominiumId: string,
    @Param('propertyId') propertyId: string,
  ) {
    return this.service.list(condominiumId, propertyId);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get document details' })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('condominiumId') condominiumId: string,
    @Param('propertyId') propertyId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.service.findOne(condominiumId, propertyId, documentId);
  }

  @Get(':documentId/download')
  @ApiOperation({ summary: 'Download document (signed URL)' })
  @HttpCode(HttpStatus.OK)
  async download(
    @Param('condominiumId') condominiumId: string,
    @Param('propertyId') propertyId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.service.getDownloadUrl(condominiumId, propertyId, documentId);
  }

  @Delete(':documentId')
  @ApiOperation({ summary: 'Delete document (soft delete)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('condominiumId') condominiumId: string,
    @Param('propertyId') propertyId: string,
    @Param('documentId') documentId: string,
  ) {
    await this.service.remove(condominiumId, propertyId, documentId);
  }
}