import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SkipUppercase } from 'src/common/decorators';

export class LoginDto {
  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'User email or CPF',
    example: 'admin@example.com',
  })
  userLogin: string;

  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'User password',
    example: '12340',
  })
  password: string;
}
