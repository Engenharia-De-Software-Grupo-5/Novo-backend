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
import { CondominioDto } from 'src/contracts/condominios/condominio.dto';
import { CondominioResponse } from 'src/contracts/condominios/condominio.response';
import { CondominioService } from 'src/services/condominios/condominio.service';

@ApiTags('Condominios')
@ApiBearerAuth('access-token')
@Controller('condominios')
export class CondominioController {
  constructor(private readonly condominioService: CondominioService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all condominiums',
    description: 'Retrieve all condominiums registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all condominiums',
    type: [CondominioResponse],
  })
  getAll(): Promise<CondominioResponse[]> {
    return this.condominioService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get condominium by ID',
    description:
      'Retrieve details of a specific condominium identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved condominium details',
    type: CondominioResponse,
  })
  getById(@Param('id') condominioId: string): Promise<CondominioResponse> {
    return this.condominioService.getById(condominioId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new condominium',
    description: 'Register a new condominium in the system.',
  })
  @ApiBody({
    description: 'Condominium data to be registered',
    type: CondominioDto,
  })
  @ApiCreatedResponse({
    description: 'Condominium successfully created',
    type: CondominioResponse,
  })
  create(@Body() dto: CondominioDto): Promise<CondominioResponse> {
    return this.condominioService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing condominium',
    description:
      'Update the data of an existing condominium identified by its ID.',
  })
  @ApiBody({
    description: 'Updated condominium data',
    type: CondominioDto,
  })
  @ApiOkResponse({
    description: 'Condominium successfully updated',
    type: CondominioResponse,
  })
  update(
    @Param('id') id: string,
    @Body() dto: CondominioDto,
  ): Promise<CondominioResponse> {
    return this.condominioService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a condominium',
    description: 'Perform a soft delete of a condominium identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Condominium successfully deleted',
    type: CondominioResponse,
  })
  delete(@Param('id') condominioId: string): Promise<CondominioResponse> {
    return this.condominioService.delete(condominioId);
  }
}
