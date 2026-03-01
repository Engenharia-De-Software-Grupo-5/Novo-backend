import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserResponse } from 'src/contracts/auth/user.response';
import { PropertyDto } from 'src/contracts/condominiums/property.dto';
import { PropertyResponse } from 'src/contracts/condominiums/property.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { PropertyService } from 'src/services/condominiums/property.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('condominios/:condId/imoveis')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all properties',
    description: 'Retrieve all properties registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all properties',
    type: [PropertyResponse],
  })
  getAll(@Param('condId') condominiumId: string) {
    return this.propertyService.getAll(condominiumId);
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get properties filtered and paginated',
    description: 'Get properties filtered and paginated',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: PaginatedResponseSchema(PropertyResponse),
  })
  getPaginated(
    @Query() data: PaginationDto,
    @Param('condominiumId') condominiumId: string,
  ): Promise<PaginatedResult<PropertyResponse>> {
    return this.propertyService.getPaginated(condominiumId, data);
  }


  @Get(':propertyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get property by ID',
    description: 'Retrieve a specific property by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the property',
    type: PropertyResponse,
  })
  getById(@Param('condId') condominiumId: string, @Param('id') propertyId: string) {
    return this.propertyService.getById(condominiumId, propertyId);
  }

 @Post()
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Create expense' })
   @ApiConsumes('multipart/form-data')
   @UseInterceptors(FilesInterceptor('files'))
   @ApiBody({
     description: 'Expense data and files',
     schema: {
       type: 'object',
       allOf: [
         { $ref: getSchemaPath(PropertyDto) },
         {
           type: 'object',
           properties: {
             files: {
               type: 'array',
               items: {
                 type: 'string',
                 format: 'binary',
               },
             },
           },
         },
       ],
     },
   })
  create(
    @Param('condId') condominiumId: string,
    @Body() dto: PropertyDto,
    @UploadedFile() inspections: Express.Multer.File[],
    @UploadedFile() documents: Express.Multer.File[]
  ) {

    return this.propertyService.create(condominiumId, dto, inspections, documents);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a property',
    description: 'Update an existing property in the system.',
  })
  @ApiBody({ type: PropertyDto })
  @ApiOkResponse({
    description: 'Successfully updated the property', 
    type: PropertyResponse,
  })
  update(@Param('condId') condominiumId: string, @Param('id') propertyId: string, @Body() dto: PropertyDto) {
    return this.propertyService.update(condominiumId, propertyId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a property',
    description: 'Delete an existing property from the system.',
  })
  @ApiOkResponse({
    description: 'Successfully deleted the property',
    type: PropertyResponse, 
  })
  delete(@Param('condId') condominiumId: string, @Param('id') propertyId: string) {
    return this.propertyService.delete(condominiumId, propertyId);
  }
}