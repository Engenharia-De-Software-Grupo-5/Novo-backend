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
import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';
import { CondominiumService } from 'src/services/condominiums/condominium.service';

@ApiTags('Condominiums')
@ApiBearerAuth('access-token')
@Controller('condominios')
export class CondominiumController {
  constructor(private readonly condominiumService: CondominiumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all condominiums',
    description: 'Retrieve all condominiums registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all condominiums',
    type: [CondominiumResponse],
  })
  getAll(): Promise<CondominiumResponse[]> {
    return this.condominiumService.getAll();
  }

  @Get(':condId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get condominium by ID',
    description:
      'Retrieve details of a specific condominium identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved condominium details',
    type: CondominiumResponse,
  })
  getById(@Param('condId') condominioId: string): Promise<CondominiumResponse> {
    return this.condominiumService.getById(condominioId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new condominium',
    description: 'Register a new condominium in the system.',
  })
  @ApiBody({
    description: 'Condominium data to be registered',
    type: CondominiumDto,
  })
  @ApiCreatedResponse({
    description: 'Condominium successfully created',
    type: CondominiumResponse,
  })
  create(@Body() dto: CondominiumDto): Promise<CondominiumResponse> {
    return this.condominiumService.create(dto);
  }

  @Put(':condId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing condominium',
    description:
      'Update the data of an existing condominium identified by its ID.',
  })
  @ApiBody({
    description: 'Updated condominium data',
    type: CondominiumDto,
  })
  @ApiOkResponse({
    description: 'Condominium successfully updated',
    type: CondominiumResponse,
  })
  update(
    @Param('condId') id: string,
    @Body() dto: CondominiumDto,
  ): Promise<CondominiumResponse> {
    return this.condominiumService.update(id, dto);
  }

  @Delete(':condId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a condominium',
    description: 'Perform a soft delete of a condominium identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Condominium successfully deleted',
    type: CondominiumResponse,
  })
  delete(@Param('condId') condominiumId: string): Promise<CondominiumResponse> {
    return this.condominiumService.delete(condominiumId);
  }
}
