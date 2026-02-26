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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PreviewContractDto } from 'src/contracts/contracts/preview.contract.dto';
import { ContractService } from 'src/services/contracts/contract.service';
import { PreviewContractService } from 'src/services/contracts/preview.contract.service';

@ApiTags('Contracts')
@ApiBearerAuth('access-token')
@Controller('condominios/:condId/contratos')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly previewContractService: PreviewContractService,
  ) { }

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
  getAll(@Param('condId') condominiumId: string): Promise<ContractResponse[]> {
    return this.contractService.getAll(condominiumId);
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
  getById(
    @Param('condId') condominiumId: string,
    @Param('id') contractId: string
  ): Promise<ContractResponse> {
    return this.contractService.getById(condominiumId, contractId);
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
    @Param('condId') condominiumId: string,
    @Body() dto: ContractDto,
    @UploadedFile() file?: Express.Multer.File, // O '?' já indica que é opcional
  ) {
    // Se o arquivo não for enviado, 'file' será undefined.
    // Seu service deve estar preparado para lidar com file sendo undefined.
    return this.contractService.create(condominiumId, dto, file);
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
    @Param('condId') condominiumId: string,
    @Param('id') contractId: string,
    @Body() dto: ContractDto,
  ): Promise<ContractResponse> {
    return this.contractService.update(condominiumId, contractId, dto);
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
  delete(
    @Param('condId') condominiumId: string,
    @Param('id') ContractId: string,
  ): Promise<ContractResponse> {
    return this.contractService.delete(condominiumId, ContractId);
  }

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Preview contract before creation',
    description: 'Generate a temporary HTML preview of the contract',
  })
  async preview(
    @Param('condId') condominiumId: string,
    @Body() dto: PreviewContractDto) {
    return this.previewContractService.execute(condominiumId, dto);
  }
}
