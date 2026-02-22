import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Example2Response } from './example2.response';

export class ExampleResponse {
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

  @ApiProperty({
    description: 'campo numérico',
    example: 10,
  })
  campoNumerico: number;

  @ApiProperty({
    description: 'campo data',
    example: '2025-02-03T00:00:00.000Z',
  })
  campoData: Date;

  @ApiProperty({
    description: 'campo boolean',
    example: true,
  })
  campoBoolean: boolean;

  @ApiProperty({
    description: 'campo que é outro objeto de response',
    type: () => Example2Response,
  })
  campoObjeto: Example2Response;

  @ApiProperty({
    description: 'lista de outro objeto de resposta',
    type: () => Example2Response,
    isArray: true,
  })
  campoObjetoArray: Example2Response[];

  @ApiProperty({
    description: 'lista de objeto simples',
    example: ['item1', 'item2', 'item3'],
    isArray: true,
  })
  simpleList: string[];
}
