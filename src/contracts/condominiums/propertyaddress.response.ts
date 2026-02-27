import { ApiProperty } from "@nestjs/swagger";

export class PropertyAddressResponse {
   @ApiProperty({
      description: 'Adress ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
  id: string;
    @ApiProperty({
      description: 'Zip code',
      example: '12345-678',
    })
  zip: string;
    @ApiProperty({
      description: 'Street',
      example: 'Rua Exemplo',
    })
  street: string;
    @ApiProperty({
      description: 'Neighborhood',
      example: 'Prata',
    })
  neighborhood: string;
    @ApiProperty({
      description: 'City',
      example: 'São Paulo',
    })
  city: string;
    @ApiProperty({
      description: 'State',
      example: 'SP',
    })
  uf: string;

    @ApiProperty({
      description: 'Number',
      example: 123,
    })
  number: number;

    @ApiProperty({
      description: 'Complement',
      example: 'Apt 101',
    })
  block?: string;

    @ApiProperty({
      description: 'Complement',
      example: 'Apt 101',
    })
  floor?: number;
    @ApiProperty({

      description: 'Complement',
      example: 'Apt 101',
    })
  totalArea?: number;

}