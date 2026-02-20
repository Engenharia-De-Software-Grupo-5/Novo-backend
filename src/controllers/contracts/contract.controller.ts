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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
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

  
  @Post(':id/link/employees/:employeeId')
  @ApiOperation({ summary: 'Link contract to employee' })
  @HttpCode(HttpStatus.OK)
  linkEmployee(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ) {
    return this.service.linkEmployee(id, employeeId);
  }

  @Delete(':id/link/employees/:employeeId')
  @ApiOperation({ summary: 'Unlink contract from employee' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkEmployee(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ) {
    await this.service.unlinkEmployee(id, employeeId);
  }

  @Post(':id/link/condominiums/:condominiumId')
  @ApiOperation({ summary: 'Link contract to condominium' })
  @HttpCode(HttpStatus.OK)
  linkCondominium(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('condominiumId', new ParseUUIDPipe()) condominiumId: string,
  ) {
    return this.service.linkCondominium(id, condominiumId);
  }

  @Delete(':id/link/condominiums/:condominiumId')
  @ApiOperation({ summary: 'Unlink contract from condominium' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkCondominium(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('condominiumId', new ParseUUIDPipe()) condominiumId: string,
  ) {
    await this.service.unlinkCondominium(id, condominiumId);
  }

  @Post(':id/link/properties/:propertyId')
  @ApiOperation({ summary: 'Link contract to property' })
  @HttpCode(HttpStatus.OK)
  linkProperty(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('propertyId', new ParseUUIDPipe()) propertyId: string,
  ) {
    return this.service.linkProperty(id, propertyId);
  }

  @Delete(':id/link/properties/:propertyId')
  @ApiOperation({ summary: 'Unlink contract from property' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkProperty(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('propertyId', new ParseUUIDPipe()) propertyId: string,
  ) {
    await this.service.unlinkProperty(id, propertyId);
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

  // consultas úteis
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