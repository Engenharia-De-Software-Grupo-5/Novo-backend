import { ApiProperty } from "@nestjs/swagger";

export class EmergencyContactResponse {
  @ApiProperty({
    description: 'Emergency contact unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Emergency contact full name',
    example: 'Ana Souza',
  })
  name: string;

  @ApiProperty({
    description: 'Emergency contact phone number',
    example: '+5511988887777',
  })
  phone: string;

  @ApiProperty({
    description: 'Emergency contact relationship to tenant',
    example: 'Sister',
  })
  relationship?: string;
}   