import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsOptional,
  IsUUID,
} from 'class-validator';

export class TenantDocumentDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'UUID of the uploaded CPF file',
    example: 'a3f1b6c2-3f9d-4e7c-8c3f-123456789abc',
  })
  cpfFileId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'UUID of the uploaded income proof file',
    example: 'b2f1c6a2-3f9d-4e7c-8c3f-987654321abc',
  })
  incomeProofId?: string;
}