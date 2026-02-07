import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { SkipUppercase } from 'src/common/decorators';

export class ResetPasswordDto {
  @IsEmail()
  @SkipUppercase()
  @ApiProperty({
    description: 'User email',
    example: 'admin@example.com',
  })
  email: string;
}
