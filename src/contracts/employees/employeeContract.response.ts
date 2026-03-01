import { ApiProperty } from '@nestjs/swagger';

export class EmployeeContractResponse {

  @ApiProperty({
    example: 'uuid-contract-id',
  })
  id: string;

  @ApiProperty({
    example: 'Contrato.pdf',
  })
  name: string;

  @ApiProperty({
    example: 'application/pdf',
  })
  type: string;

  @ApiProperty({
    example: 24576,
  })
  size: number;

  @ApiProperty({
    example: 'https://api.meusite.com/contracts/uuid',
  })
  url: string;
}