import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentUser, IsPublic } from 'src/common/decorators';
import { AuthPayload } from 'src/contracts/auth';
import { AuthJwtResponse } from 'src/contracts/auth/jwt.response';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Current user info',
    description: 'Returns login info about current user.',
  })
  @ApiOkResponse({
    description: 'Success',
    type: AuthJwtResponse,
  })
  getMe(@CurrentUser() user: AuthPayload): AuthJwtResponse {
    const { sub: id, email, name, permission, cpf } = user;
    return {
      id,
      email,
      name,
      permission,
      cpf,
    };
  }
}
