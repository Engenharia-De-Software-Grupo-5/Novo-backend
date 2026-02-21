import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class PaginatedResult<T> {
  @ApiProperty({
    description: 'Lista de itens retornados na página atual',
    type: 'array',
    items: { oneOf: [{ $ref: getSchemaPath(Object) }] },
  })
  static of<T>(itemType: new () => T) {
    const cls = PaginatedResult as any;
    cls.prototype.__itemType = itemType;
    return cls as new () => PaginatedResult<T>;
  }
  items: T[];

  @ApiProperty({
    description: 'Informações sobre a paginação',
    type: 'object',
    properties: {
      totalItems: {
        type: 'number',
        description: 'Quantidade total de itens disponíveis',
      },
      totalPages: {
        type: 'number',
        description: 'Número total de páginas disponíveis',
      },
      pageNumber: {
        type: 'number',
        description: 'Número da página atual (1-based)',
      },
      pageSize: {
        type: 'number',
        description: 'Quantidade de itens por página (15-based)',
      },
    },
  })
  meta: {
    totalItems: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}
