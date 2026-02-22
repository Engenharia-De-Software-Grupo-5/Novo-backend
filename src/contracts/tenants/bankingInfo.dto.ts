import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BankingInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bank name',
    example: 'Banco do Brasil',
  })
  bank: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type of bank account',
    example: 'Checking',
  })
  accountType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bank account number',
    example: '123456-7',
  })
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bank agency number',
    example: '0001',
  })
  agency: string;
}