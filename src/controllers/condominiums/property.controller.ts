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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PropertyDto } from 'src/contracts/condominiums/property.dto';
import { PropertyResponse } from 'src/contracts/condominiums/property.dto.response';
import { PropertyService } from 'src/services/condominiums/property.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('condominiums/:condominiumId/properties')
export class PropertyController {
  constructor(private readonly imovelService: PropertyService) {}
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
  getAll(@Param('condominiumId') condominiumId: string) {
    return this.imovelService.getAll(condominiumId);
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
  getById(@Param('condominiumId') condominiumId: string, @Param('propertyId') propertyId: string) {
    return this.imovelService.getById(condominiumId, propertyId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new property',
    description: 'Create a new property in the system.',
  })
  @ApiBody({ type: PropertyDto })
  @ApiCreatedResponse({
    description: 'Successfully created the property',
    type: PropertyResponse,
  })
  create(@Param('condominiumId') condominiumId: string, @Body() dto: PropertyDto) {
    return this.imovelService.create(condominiumId, dto);
  }

  @Put(':propertyId')
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
  update(@Param('condominiumId') condominiumId: string, @Param('propertyId') propertyId: string, @Body() dto: PropertyDto) {
    return this.imovelService.update(condominiumId, propertyId, dto);
  }

  @Delete(':propertyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a property',
    description: 'Delete an existing property from the system.',
  })
  @ApiOkResponse({
    description: 'Successfully deleted the property',
    type: PropertyResponse, 
  })
  delete(@Param('condominiumId') condominiumId: string, @Param('propertyId') propertyId: string) {
    return this.imovelService.delete(condominiumId, propertyId);
  }
}