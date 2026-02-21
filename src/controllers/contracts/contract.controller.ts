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
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { ContractService } from 'src/services/contracts/contract.service';

@ApiTags('Contracts')
@ApiBearerAuth('access-token')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all contracts',
    description: 'Retrieve all contracts registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all contracts',
    type: [ContractResponse],
  })
  getAll(): Promise<ContractResponse[]> {
    return this.contractService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get contract by ID',
    description:
      'Retrieve details of a specific contract identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved contract details',
    type: ContractResponse,
  })
  getById(@Param('id') ContratoId: string): Promise<ContractResponse> {
    return this.contractService.getById(ContratoId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new contract',
    description: 'Register a new contract in the system.',
  })
  @ApiBody({
    description: 'contract data to be registered',
    type: ContractDto,
  })
  @ApiCreatedResponse({
    description: 'contract successfully created',
    type: ContractResponse,
  })
  create(@Body() dto: ContractDto): Promise<ContractResponse> {
    return this.contractService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing contract',
    description:
      'Update the data of an existing contract identified by its ID.',
  })
  @ApiBody({
    description: 'Updated contract data',
    type: ContractDto,
  })
  @ApiOkResponse({
    description: 'contract successfully updated',
    type: ContractResponse,
  })
  update(
    @Param('id') id: string,
    @Body() dto: ContractDto,
  ): Promise<ContractResponse> {
    return this.contractService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a contract',
    description: 'Perform a soft delete of a contract identified by its ID.',
  })
  @ApiOkResponse({
    description: 'contract successfully deleted',
    type: ContractResponse,
  })
  delete(@Param('id') ContractId: string): Promise<ContractResponse> {
    return this.contractService.delete(ContractId);
  }

  @Post(':id')
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
    return this.contractService.upload(file);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download URL (presigned)' })
  @HttpCode(HttpStatus.OK)
  download(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contractService.getDownloadUrl(id);
  }
}
