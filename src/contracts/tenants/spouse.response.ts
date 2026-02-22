import { ApiProperty } from "@nestjs/swagger";

export class SpouseResponse {
  @ApiProperty({
    description: 'Spouse unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Spouse full name',
    example: 'João Pereira',
  })
  name: string;

  @ApiProperty({
    description: 'Spouse CPF (numbers only)',
    example: '17508074084',
  })
  cpf: string;

  @ApiProperty({
    description: 'Spouse profession',
    example: 'Doctor',
  })
  profession: string;

  @ApiProperty({
    description: 'Spouse monthly income',
    example: 8000,
  })
  monthlyIncome: number;

  @ApiProperty({
    description: 'Spouse birth date',
    example: '1990-05-10T00:00:00.000Z',
  })
  birthDate: Date;
}