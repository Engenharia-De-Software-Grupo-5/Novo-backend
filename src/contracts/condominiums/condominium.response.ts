import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressResponse } from './address.response';
import { PropertyResponse } from './property.response';

export class CondominiumResponse {
   @ApiProperty({
      description: 'Condominium ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
  id: string;

    @ApiProperty({
      description: 'Condominium name',
      example: 'Benvenuto',
    })
  name: string;
    @ApiPropertyOptional({
      description: 'Condominium description',
      example: 'Condominium classe A',
    })
  description?: string;
    @ApiProperty({
      description: 'Condominium address',
      type: () => AddressResponse,
    })
  address: AddressResponse;
}
