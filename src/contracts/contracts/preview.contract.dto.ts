import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class PreviewContractDto {
  @ApiProperty({
    description: 'ID do template de contrato',
    example: '123',
  })
  @IsString()
  templateId: string;

  @ApiProperty({ description: 'Dados preenchidos do front' })
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({
    description: 'Markdown editado'
  })
  @IsString()
  editedMarkdown?: string;

}