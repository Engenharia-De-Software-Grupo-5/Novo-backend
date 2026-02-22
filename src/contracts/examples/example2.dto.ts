import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Example2Dto {
  @ApiProperty({
    description: 'descrição de exemplo para campo obrigatório',
    example: 'conteúdo de exemplo',
  })
  campo1: string;

  @ApiPropertyOptional({
    description: 'descrição de exemplo para campo não obrigatório',
    example: 'conteúdo de exemplo',
  })
  campo2?: string;
}
