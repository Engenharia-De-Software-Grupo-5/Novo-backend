import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';


@ApiTags('Employee Contracts')
@ApiBearerAuth('access-token')
@Controller('employees/:employeeId/contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeContractsController {
  constructor(private readonly service: EmployeeContractsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Upload an employee contract (PDF only)',
    description: 'Upload a new PDF contract linked to an employee.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('employeeId') employeeId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Envie um arquivo no campo "file".');
    return this.service.upload(employeeId, file);
  }

  @Get()
  @ApiOperation({
    summary: 'List employee contracts',
    description: 'Retrieve a list of contracts linked to an employee.',
  })
  @HttpCode(HttpStatus.OK)
  async list(@Param('employeeId') employeeId: string) {
    return this.service.list(employeeId);
  }

  @Get(':contractId')
  @ApiOperation({
    summary: 'Get employee contract details',
    description: 'Retrieve details of a specific employee contract by its ID.',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('employeeId') employeeId: string,
    @Param('contractId') contractId: string,
  ) {
    return this.service.findOne(employeeId, contractId);
  }

  @Get(':contractId/download')
  @ApiOperation({
    summary: 'Download employee contract file',
    description: 'Get a temporary URL to download the employee contract PDF.',
  })
  @HttpCode(HttpStatus.OK)
  async download(
    @Param('employeeId') employeeId: string,
    @Param('contractId') contractId: string,
  ) {
    return this.service.getDownloadUrl(employeeId, contractId);
  }

  @Delete(':contractId')
  @ApiOperation({
    summary: 'Delete employee contract',
    description: 'Soft delete an employee contract by its ID.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('employeeId') employeeId: string,
    @Param('contractId') contractId: string,
  ) {
    await this.service.remove(employeeId, contractId);
  }
}