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
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
import { TenantService } from 'src/services/tenants/tenant.service';


@ApiTags('Tenants')
@ApiBearerAuth('access-token')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all tenants',
    description: 'Retrieve all tenants registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all tenants',
    type: [TenantResponse],
  })
  getAll(): Promise<TenantResponse[]> {
    return this.tenantService.getAll();
  }

  @Get('paginated')
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
      @Query() data: PaginationDto,
    ): Promise<PaginatedResult<TenantResponse>> {
      return this.tenantService.getPaginated(data);
    }
  

  @Get(':cpf')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get tenant by CPF',
    description:
      'Retrieve details of a specific tenant identified by its CPF.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved tenant details by CPF',
    type: TenantResponse,
  })
  getByCpf(@Param('cpf') cpf: string): Promise<TenantResponse> {
    return this.tenantService.getByCpf(cpf);
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
  getById(@Param('id') tenantId: string): Promise<TenantResponse> {
    return this.tenantService.getById(tenantId);
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
  create(@Body() dto: TenantDto): Promise<TenantResponse> {
    return this.tenantService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing tenant',
    description:
      'Update the data of an existing tenant identified by its ID.',
  })
  @ApiBody({
    description: 'Updated tenant data',
    type: TenantDto,
  })
  @ApiOkResponse({
    description: 'Tenant successfully updated',
    type: TenantResponse,
  })
  update(
    @Param('id') id: string,
    @Body() dto: TenantDto,
  ): Promise<TenantResponse> {
    return this.tenantService.update(id, dto);
  }

  @Delete(':cpf')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete tenant by CPF',
    description:
      'Soft delete a specific tenant identified by its CPF.',
  })
  @ApiOkResponse({
    description: 'Successfully deleted tenant by CPF',
    type: TenantResponse,
  })
  deleteByCpf(@Param('cpf') cpf: string): Promise<TenantResponse> {
    return this.tenantService.deleteByCpf(cpf);
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
  delete(@Param('id') tenantId: string): Promise<TenantResponse> {
    return this.tenantService.deleteById(tenantId);
  }
}