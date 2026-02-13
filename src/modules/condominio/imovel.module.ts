import { Module } from '@nestjs/common';
import { ImovelController } from "src/controllers/condominios/imovel.controller";
import { ImovelRepository } from "src/repositories/condominios/imovel.repository";
import { ImovelService } from "src/services/condominios/imovel.service";

@Module({
  imports: [],
  controllers: [ImovelController],
  providers: [ImovelService, ImovelRepository],
})
export class ImovelModule {}