import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CondominioDto } from 'src/contracts/condominios/condominio.dto';
import { CondominioResponse } from 'src/contracts/condominios/condominio.response';
import { CondominioService } from 'src/services/condominios/condominio.service';

@ApiTags('Condominios')
@ApiBearerAuth('access-token')
@Controller('condominios')
export class CondominioController {
  constructor(private readonly condominioService: CondominioService) {}

  @Get()
  getAll(): Promise<CondominioResponse[]> {
    return this.condominioService.getAll();
  }

  @Get(':id')
  getById(@Param('id') condominioId: string): Promise<CondominioResponse> {
    return this.condominioService.getById(condominioId);
  }

  @Post()
  create(@Body() dto: CondominioDto): Promise<CondominioResponse> {
    return this.condominioService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CondominioDto,
  ): Promise<CondominioResponse> {
    return this.condominioService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') condominioId: string): Promise<CondominioResponse> {
    return this.condominioService.delete(condominioId);
  }
}
