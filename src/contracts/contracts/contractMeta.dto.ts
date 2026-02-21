import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class ContractMetaDto {
  @ApiPropertyOptional({
    description: 'Tenant CPF for searching contracts (11 digits)',
    example: '11111111111',
  })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/)
  tenantCpf?: string;
}