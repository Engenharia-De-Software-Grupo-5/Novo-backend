import { ApiProperty } from "@nestjs/swagger";

export class AdditionalResidentResponse {
  @ApiProperty({
    description: 'Additional resident unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Additional resident full name',
    example: 'Carlos Oliveira',
  })
  name: string;

  @ApiProperty({
    description: 'Additional resident birth date',
    example: '1985-03-15T00:00:00.000Z',
  })
  birthDate: Date;

  @ApiProperty({
    description: 'Additional resident relationship to tenant',
    example: 'Brother',
  })
  relationship?: string;
}