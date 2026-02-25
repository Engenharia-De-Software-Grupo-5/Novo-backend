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
import { PropertyResponse } from 'src/contracts/condominiums/property.response';
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

  @Get(':id')
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
  create(@Param('condId') condominiumId: string, @Body() dto: PropertyDto) {
    return this.propertyService.create(condominiumId, dto);
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