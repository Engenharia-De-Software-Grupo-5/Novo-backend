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
import { ImovelDto } from 'src/contracts/condominios/imovel.dto';
import { ImovelResponse } from 'src/contracts/condominios/imovel.dto.response';
import { ImovelService } from 'src/services/condominios/imovel.service';

@ApiTags('imoveis')
@ApiBearerAuth('access-token')
@Controller('condominios/:condominioId/imoveis')
export class ImovelController {
  constructor(private readonly imovelService: ImovelService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all properties',
    description: 'Retrieve all properties registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all properties',
    type: [ImovelResponse],
  })
  getAll(@Param('condominioId') condominioId: string) {
    return this.imovelService.getAll(condominioId);
  }

  @Get(':imovelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get property by ID',
    description: 'Retrieve a specific property by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the property',
    type: ImovelResponse,
  })
  getById(@Param('condominioId') condominioId: string, @Param('imovelId') imovelId: string) {
    return this.imovelService.getById(condominioId, imovelId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new property',
    description: 'Create a new property in the system.',
  })
  @ApiBody({ type: ImovelDto })
  @ApiCreatedResponse({
    description: 'Successfully created the property',
    type: ImovelResponse,
  })
  create(@Param('condominioId') condominioId: string, @Body() dto: ImovelDto) {
    return this.imovelService.create(condominioId, dto);
  }

  @Put(':imovelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a property',
    description: 'Update an existing property in the system.',
  })
  @ApiBody({ type: ImovelDto })
  @ApiOkResponse({
    description: 'Successfully updated the property', 
    type: ImovelResponse,
  })
  update(@Param('condominioId') condominioId: string, @Param('imovelId') imovelId: string, @Body() dto: ImovelDto) {
    return this.imovelService.update(condominioId, imovelId, dto);
  }
  
  @Delete(':imovelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a property',
    description: 'Delete an existing property from the system.',
  })
  @ApiOkResponse({
    description: 'Successfully deleted the property',
    type: ImovelResponse, 
  })
  delete(@Param('condominioId') condominioId: string, @Param('imovelId') imovelId: string) {
    return this.imovelService.delete(condominioId, imovelId);
  }
}