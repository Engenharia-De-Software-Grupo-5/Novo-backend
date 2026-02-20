import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
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
      properties: {
        file: { type: 'string', format: 'binary' },
        ownerCpf: { type: 'string', example: '11111111111' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async upload(
    @UploadedFile() file?: Express.Multer.File,
    @Query('ownerCpf') ownerCpf?: string,
  ) {
    if (!file) throw new BadRequestException('Uploaded file is required.');
    return this.service.upload(file, ownerCpf);
  }

  @Get()
  @ApiOperation({ summary: 'List contracts' })
  @ApiQuery({ name: 'ownerCpf', type: String, required: false, description: 'Filter by owner CPF', example: '11111111111' })
  @HttpCode(HttpStatus.OK)
  list(@Query('ownerCpf') ownerCpf?: string) {
    return this.service.list(ownerCpf);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract details (includes presigned url)' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download URL (presigned)' })
  @HttpCode(HttpStatus.OK)
  download(@Param('id') id: string) {
    return this.service.getDownloadUrl(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contract' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }


  @Post(':id/link/employees/:employeeId')
  @ApiOperation({ summary: 'Link contract to employee' })
  @HttpCode(HttpStatus.OK)
  linkEmployee(@Param('id') id: string, @Param('employeeId') employeeId: string) {
    return this.service.linkEmployee(id, employeeId);
  }

  @Delete(':id/link/employees/:employeeId')
  @ApiOperation({ summary: 'Unlink contract from employee' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkEmployee(@Param('id') id: string, @Param('employeeId') employeeId: string) {
    await this.service.unlinkEmployee(id, employeeId);
  }

  @Post(':id/link/condominiums/:condominiumId')
  @ApiOperation({ summary: 'Link contract to condominium' })
  @HttpCode(HttpStatus.OK)
  linkCondominium(@Param('id') id: string, @Param('condominiumId') condominiumId: string) {
    return this.service.linkCondominium(id, condominiumId);
  }

  @Delete(':id/link/condominiums/:condominiumId')
  @ApiOperation({ summary: 'Unlink contract from condominium' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkCondominium(@Param('id') id: string, @Param('condominiumId') condominiumId: string) {
    await this.service.unlinkCondominium(id, condominiumId);
  }

  @Post(':id/link/properties/:propertyId')
  @ApiOperation({ summary: 'Link contract to property' })
  @HttpCode(HttpStatus.OK)
  linkProperty(@Param('id') id: string, @Param('propertyId') propertyId: string) {
    return this.service.linkProperty(id, propertyId);
  }

  @Delete(':id/link/properties/:propertyId')
  @ApiOperation({ summary: 'Unlink contract from property' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkProperty(@Param('id') id: string, @Param('propertyId') propertyId: string) {
    await this.service.unlinkProperty(id, propertyId);
  }

  // Consultas do requisito (CPF/id condomínio)
  @Get('/by-employee/:employeeId')
  @ApiOperation({ summary: 'List contracts linked to employee' })
  @HttpCode(HttpStatus.OK)
  listByEmployee(@Param('employeeId') employeeId: string) {
    return this.service.listByEmployee(employeeId);
  }

  @Get('/by-condominium/:condominiumId')
  @ApiOperation({ summary: 'List contracts linked to condominium' })
  @HttpCode(HttpStatus.OK)
  listByCondominium(@Param('condominiumId') condominiumId: string) {
    return this.service.listByCondominium(condominiumId);
  }
}