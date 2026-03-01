// import {
//   BadRequestException,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   UseInterceptors,
//   UploadedFile,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
// import { PropertyInspectionsService } from 'src/services/condominiums/property-inspections.service';

// @ApiTags('Property Inspections')
// @ApiBearerAuth('access-token')
// @Controller('condominiums/:condominiumId/properties/:propertyId/inspections')
// export class PropertyInspectionsController {
//   constructor(private readonly service: PropertyInspectionsService) {}

//   @Post()
//   @ApiConsumes('multipart/form-data')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Upload a property inspection file',
//     description: 'Upload a new inspection file linked to a property.',
//   })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       required: ['file'],
//       properties: {
//         file: { type: 'string', format: 'binary' },
//       },
//     },
//   })
//   @UseInterceptors(FileInterceptor('file'))
//   async upload(
//     @Param('condominiumId') condominiumId: string,
//     @Param('propertyId') propertyId: string,
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     if (!file) throw new BadRequestException('Envie um arquivo no campo "file".');
//     return this.service.upload(condominiumId, propertyId, file);
//   }

//   @Get()
//   @ApiOperation({ summary: 'List property inspections' })
//   @HttpCode(HttpStatus.OK)
//   async list(
//     @Param('condominiumId') condominiumId: string,
//     @Param('propertyId') propertyId: string,
//   ) {
//     return this.service.list(condominiumId, propertyId);
//   }

//   @Get(':inspectionId')
//   @ApiOperation({ summary: 'Get inspection details' })
//   @HttpCode(HttpStatus.OK)
//   async findOne(
//     @Param('condominiumId') condominiumId: string,
//     @Param('propertyId') propertyId: string,
//     @Param('inspectionId') inspectionId: string,
//   ) {
//     return this.service.findOne(condominiumId, propertyId, inspectionId);
//   }

//   @Get(':inspectionId/download')
//   @ApiOperation({ summary: 'Download inspection file (signed URL)' })
//   @HttpCode(HttpStatus.OK)
//   async download(
//     @Param('condominiumId') condominiumId: string,
//     @Param('propertyId') propertyId: string,
//     @Param('inspectionId') inspectionId: string,
//   ) {
//     return this.service.getDownloadUrl(condominiumId, propertyId, inspectionId);
//   }

//   @Delete(':inspectionId')
//   @ApiOperation({ summary: 'Delete inspection (soft delete)' })
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async remove(
//     @Param('condominiumId') condominiumId: string,
//     @Param('propertyId') propertyId: string,
//     @Param('inspectionId') inspectionId: string,
//   ) {
//     await this.service.remove(condominiumId, propertyId, inspectionId);
//   }
// }