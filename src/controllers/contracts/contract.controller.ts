import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { ContractsService } from 'src/services/contracts/contract.service';

@ApiTags('Contracts')
@ApiBearerAuth('access-token')
@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a contract (PDF)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Uploaded file is required.');
    return this.service.upload(file);
  }

  @Get()
  @ApiOperation({ summary: 'List contracts' })
  @ApiQuery({
    name: 'tenantCpf',
    required: false,
    type: String,
    description: 'Filter contracts by tenant CPF (11 digits)',
    example: '11111111111',
  })
  @HttpCode(HttpStatus.OK)
  list(@Query('tenantCpf') tenantCpf?: string) {
    return this.service.list(tenantCpf);
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get service types filtered and paginated',
    description: 'Get service types filtered and paginated',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: PaginatedResponseSchema(ContractResponse),
  })
  getPaginated(
    @Query() data: PaginationDto,
  ): Promise<PaginatedResult<ContractResponse>> {
    return this.service.listPaginated(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract details (includes presigned url)' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download URL (presigned)' })
  @HttpCode(HttpStatus.OK)
  download(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.getDownloadUrl(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contract' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.remove(id);
  }


  @Post(':id/leases')
  @ApiOperation({ summary: 'Link contract to a lease (tenant + property)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['tenantId', 'propertyId'],
      properties: {
        tenantId: { type: 'string', format: 'uuid' },
        propertyId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  linkLease(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('tenantId', new ParseUUIDPipe()) tenantId: string,
    @Body('propertyId', new ParseUUIDPipe()) propertyId: string,
  ) {
    return this.service.linkLease(id, propertyId, tenantId);
  }

  @Delete(':id/leases')
  @ApiOperation({ summary: 'Unlink contract from a lease (tenant + property)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['tenantId', 'propertyId'],
      properties: {
        tenantId: { type: 'string', format: 'uuid' },
        propertyId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkLease(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('tenantId', new ParseUUIDPipe()) tenantId: string,
    @Body('propertyId', new ParseUUIDPipe()) propertyId: string,
  ) {
    await this.service.unlinkLease(id, propertyId, tenantId);
  }


  @Get('/by-tenant/:tenantId')
  @ApiOperation({ summary: 'List contracts linked to tenant' })
  @HttpCode(HttpStatus.OK)
  listByTenant(@Param('tenantId', new ParseUUIDPipe()) tenantId: string) {
    return this.service.listByTenant(tenantId);
  }

  @Get('/by-property/:propertyId')
  @ApiOperation({ summary: 'List contracts linked to property (via leases)' })
  @HttpCode(HttpStatus.OK)
  listByProperty(@Param('propertyId', new ParseUUIDPipe()) propertyId: string) {
    return this.service.listByProperty(propertyId);
  }
}