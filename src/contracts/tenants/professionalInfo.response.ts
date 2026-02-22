import { ApiProperty } from "@nestjs/swagger";
import { AddressResponse } from "../condominiums/address.response";


export class ProfessionalInfoResponse {
  @ApiProperty({
    description: 'Professional info unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tenant position',
    example: 'Software Engineer',
  })
  position: string;

  @ApiProperty({
    description: 'Tenant company name',
    example: 'Tech Solutions Ltda',
  })
  companyName: string;

  @ApiProperty({
    description: 'Tenant company phone',
    example: '+5511999999999',
  })
  companyPhone: string;

  @ApiProperty({
    description: 'Tenant company address',
    type: () => AddressResponse,
  })
  companyAddress?: AddressResponse;

  @ApiProperty({
    description: 'Tenant months working',
    example: 12,
  })
  monthsWorking: number;
}   