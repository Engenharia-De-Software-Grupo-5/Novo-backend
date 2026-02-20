import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContractResponse {
  @ApiProperty({ description: 'UUID of the contract', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({description: 'Object name of the contract file', example: 'contracts/2023/09/15/123e4567-e89b-12d3-a456-426614174000.pdf'})
  objectName: string;

  @ApiProperty({description: 'Original name of the contract file', example: 'contract.pdf'})
  originalName: string;

  @ApiProperty({description: 'MIME type of the contract file', example: 'application/pdf'})
  mimeType: string;

  @ApiProperty({description: 'File extension of the contract', example: 'pdf'})
  extension: string;

  @ApiProperty({ description: 'Size of the contract file in bytes', example: 102400 })
  size: number;

  @ApiProperty({example: '2023-09-15T14:48:00.000Z' })
  createdAt: string;

  @ApiPropertyOptional({example: '2023-10-01T10:30:00.000Z', description: 'Date when the contract was deleted, if applicable'})
  deletedAt?: string | null;
}