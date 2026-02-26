import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ContractTemplateDto } from "src/contracts/contract.templates/contract.template.dto";
import { ContractTemplateResponse } from "src/contracts/contract.templates/contract.template.response";
import { ContractTemplateService } from "src/services/contract.templates/contract.template.service";

@ApiTags('ContractTemplates')
@ApiBearerAuth('access-token')
@Controller('condominios/:condId/modelos-contrato')
export class ContractTemplateController {
    constructor(private readonly contractTemplateService: ContractTemplateService) { }

    @ApiQuery({
        name: 'name',
        type: String,
        required: false
    })
    @Get()
    getAll(@Param('condId') condominiumId: string,
        @Query('name') name?: string
    ): Promise<ContractTemplateResponse[]> {
        return this.contractTemplateService.getAll(condominiumId, name)
    }

    @Get(':id')
    getById(
        @Param('condId') condominiumId: string,
        @Param('id') contractTemplateId: string
    ): Promise<ContractTemplateResponse> {
        return this.contractTemplateService.getById(condominiumId, contractTemplateId)
    }

    @Post()
    create(
        @Param('condId') condominiumId: string,
        @Body() dto: ContractTemplateDto
    ): Promise<ContractTemplateResponse> {
        return this.contractTemplateService.create(condominiumId, dto)
    }

    @Put(':id')
    update(
        @Param('condId') condominiumId: string,
        @Param('id') contractTemplateId: string,
        @Body() dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
        return this.contractTemplateService.update(condominiumId, contractTemplateId, dto)
    }

    @Delete(':id')
    delete(
        @Param('condId') condominiumId: string,
        @Param('id') contractTemplateId: string): Promise<ContractTemplateResponse> {
        return this.contractTemplateService.delete(condominiumId, contractTemplateId)
    }
}