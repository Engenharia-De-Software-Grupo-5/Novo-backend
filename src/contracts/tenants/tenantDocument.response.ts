import { ApiProperty } from "@nestjs/swagger";

export class TenantDocumentResponse {
  @ApiProperty({
    description: 'Tenant document unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tenant CPF (numbers only)',
    example: '12345678900',
  })
  cpfFileId: string;

  @ApiProperty({
    description: 'Income proof document ID',
    example: 'income-proof-uuid-example',
  })
  incomeProofId: string;
}