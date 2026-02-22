import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IsPublic } from 'src/common/decorators';
import { AuthService } from 'src/services/auth/auth.service';
import { LocalAuthGuard } from 'src/common/guards';
import { LoginDto, LoginResponse } from 'src/contracts/auth';
import { AuthRequestModel } from 'src/contracts/auth/auth-request.model';
import { ResetPasswordDto } from 'src/contracts/auth/reset-password.dto';
import { MailService } from 'src/services/tools/mail.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @IsPublic()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'user login that returns a validation token',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials for login',
  })
  @ApiOkResponse({
    description: 'Login success.',
    type: LoginResponse,
  })
  login(@Request() req: AuthRequestModel): LoginResponse {
    return this.authService.login(req.user);
  }

  @IsPublic()
  @Put('login/password')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Send password reset email',
    description: 'Send an email to the user with a new random password',
  })
  @ApiBody({
    description: 'Email address of the user',
    type: ResetPasswordDto,
  })
  @ApiAcceptedResponse({
    description: 'Password reset email sent successfully.',
  })
  async passwordResetEmail(
    @Body() authResetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    try {
      const password: string = await this.authService.passwordResetEmail(
        authResetPasswordDto.email,
      );
      void this.mailService.sendMail(
        authResetPasswordDto.email,
        'Password Reset',
        `Your new password is: ${password}`,
      );
    } catch (error) {
      this.logger.error(`Password reset failed for email: ${authResetPasswordDto.email}`, error);
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }
  }
}
