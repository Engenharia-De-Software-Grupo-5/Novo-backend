import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
import { TenantPatchDto } from 'src/contracts/tenants/tenantPatch.dto';
import { TenantService } from 'src/services/tenants/tenant.service';


@ApiTags('Condominos')
@ApiBearerAuth('access-token')
@Controller('condominios/:condId/condominos')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('sem-paginacao')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all tenants',
    description: 'Retrieve all tenants registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all tenants',
    type: [TenantResponse],
  })
  getAll(@Param('condId') condId: string): Promise<TenantResponse[]> {
    return this.tenantService.getAll(condId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get contracts filtered and paginated',
    description: 'Get contracts filtered and paginated',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: PaginatedResponseSchema(TenantResponse),
  })
  getPaginated(
    @Param('condId') condId: string,
    @Query() data: PaginationDto,
  ): Promise<PaginatedResult<TenantResponse>> {
    return this.tenantService.getPaginated(condId, data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get tenant by ID',
    description:
      'Retrieve details of a specific tenant identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved tenant details',
    type: TenantResponse,
  })
  getById(@Param('condId') condId: string, @Param('id') tenantId: string): Promise<TenantResponse> {
    return this.tenantService.getById(condId, tenantId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new tenant',
    description: 'Register a new tenant in the system.',
  })
  @ApiBody({
    description: 'Tenant data to be registered',
    type: TenantDto,
  })
  @ApiCreatedResponse({
    description: 'Tenant successfully created',
    type: TenantResponse,
  })
  create(@Param('condId') condId: string, @Body() dto: TenantDto): Promise<TenantResponse> {
    return this.tenantService.create(condId, dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing tenant',
    description:
      'Update the data of an existing tenant identified by its ID.',
  })
  @ApiBody({
    description: 'Updated tenant data',
    type: TenantPatchDto,
  })
  @ApiOkResponse({
    description: 'Tenant successfully updated',
    type: TenantResponse,
  })
  update(
    @Param('condId') condId: string,
    @Param('id') id: string,
    @Body() dto: TenantPatchDto,
  ): Promise<TenantResponse> {
    return this.tenantService.update(condId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a tenant',
    description: 'Perform a soft delete of a tenant identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Tenant successfully deleted',
    type: TenantResponse,
  })
  delete(@Param('condId') condId: string, @Param('id') tenantId: string): Promise<TenantResponse> {
    return this.tenantService.deleteById(condId, tenantId);
  }
}