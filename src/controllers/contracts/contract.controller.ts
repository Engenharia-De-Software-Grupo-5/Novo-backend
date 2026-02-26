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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PreviewContractDto } from 'src/contracts/contracts/preview.contract.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { ContractService } from 'src/services/contracts/contract.service';
import { PreviewContractService } from 'src/services/contracts/preview.contract.service';

@ApiTags('Contracts')
@ApiBearerAuth('access-token')
@Controller('contracts')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly previewContractService: PreviewContractService,
  ) {}

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

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get contracts filtered and paginated',
    description: 'Get contracts filtered and paginated',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: PaginatedResponseSchema(ContractResponse),
  })
  getPaginated(
    @Query() data: PaginationDto,
  ): Promise<PaginatedResult<ContractResponse>> {
    return this.contractService.listPaginated(data);
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create contract with (optional) PDF upload' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          nullable: true, // Indica explicitamente ao Swagger que é opcional
        },
        tenantId: { type: 'string' },
        propertyId: { type: 'string' },
        contractTemplateId: { type: 'string' },
        description: { type: 'string' },
      },
      // 'file' e 'description' fora do required
      required: ['tenantId', 'propertyId', 'contractTemplateId'],
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async createWithFile(
    @Body() dto: ContractDto,
    @UploadedFile() file?: Express.Multer.File, // O '?' já indica que é opcional
  ) {
    // Se o arquivo não for enviado, 'file' será undefined.
    // Seu service deve estar preparado para lidar com file sendo undefined.
    return this.contractService.create(dto, file);
  }

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({
  //   summary: 'Create a new contract',
  //   description: 'Register a new contract in the system.',
  // })
  // @ApiBody({
  //   description: 'contract data to be registered',
  //   type: ContractDto,
  // })
  // @ApiCreatedResponse({
  //   description: 'contract successfully created',
  //   type: ContractResponse,
  // })
  // create(@Body() dto: ContractDto): Promise<ContractResponse> {
  //   return this.contractService.create(dto);
  // }

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

  // @Post()
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Upload a contract (PDF)' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     required: ['file'],
  //     properties: { file: { type: 'string', format: 'binary' } },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file'))
  // @HttpCode(HttpStatus.OK)
  // async upload(@UploadedFile() file?: Express.Multer.File) {
  //   if (!file) throw new BadRequestException('Uploaded file is required.');
  //   return this.contractService.upload(file);
  // }

  // @Get(':id/download')
  // @ApiOperation({ summary: 'Get download URL (presigned)' })
  // @HttpCode(HttpStatus.OK)
  // download(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.contractService.getDownloadUrl(id);
  // }

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Preview contract before creation',
    description: 'Generate a temporary HTML preview of the contract',
  })
  async preview(@Body() dto: PreviewContractDto) {
    return this.previewContractService.execute(dto);
  }
}
