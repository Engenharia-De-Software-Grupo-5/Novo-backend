import { ApiProperty } from "@nestjs/swagger";

export class BankingInfoResponse {
  @ApiProperty({
    description: 'Tenant banking info unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tenant bank name',
    example: 'Banco do Brasil',
  })
  bank: string;

  @ApiProperty({
    description: 'Tenant bank account number',
    example: '12345678',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Tenant bank agency number',
    example: '1234',
  })
  agency: string;

  @ApiProperty({
    description: 'Tenant bank account type',
    example: 'Checking',
  })
  accountType: string;
}