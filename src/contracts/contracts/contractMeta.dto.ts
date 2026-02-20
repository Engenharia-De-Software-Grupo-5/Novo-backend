import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class ContractMetaDto {
  @ApiPropertyOptional({ description: 'Owner CPF for searching contracts', example: '11111111111' })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/)
  ownerCpf?: string;
}