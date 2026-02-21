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
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { CondominiumService } from 'src/services/condominiums/condominium.service';

@ApiTags('Condominiums')
@ApiBearerAuth('access-token')
@Controller('condominiums')
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

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get condominiums filtered and paginated',
    description: 'Get condominiums filtered and paginated',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: PaginatedResponseSchema(CondominiumResponse),
  })
  getPaginated(
    @Query() data: PaginationDto,
  ): Promise<PaginatedResult<CondominiumResponse>> {
    return this.condominiumService.getPaginated(data);
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
    type: CondominiumResponse,
  })
  getById(@Param('id') condominioId: string): Promise<CondominiumResponse> {
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

  @Put(':id')
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
    @Param('id') id: string,
    @Body() dto: CondominiumDto,
  ): Promise<CondominiumResponse> {
    return this.condominiumService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a condominium',
    description: 'Perform a soft delete of a condominium identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Condominium successfully deleted',
    type: CondominiumResponse,
  })
  delete(@Param('id') condominiumId: string): Promise<CondominiumResponse> {
    return this.condominiumService.delete(condominiumId);
  }
}
