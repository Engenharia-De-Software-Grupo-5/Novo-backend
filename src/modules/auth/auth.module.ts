import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/guards/strategies/jwt.strategy';
import { LocalStrategy } from 'src/common/guards/strategies/local.strategy';
import { LoginValidationMiddleware } from 'src/common/middlewares/login-validation.middleware';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { AuthRepository } from 'src/repositories/auth/auth.repository';
import { AuthService } from 'src/services/auth/auth.service';
import { MailService } from 'src/services/tools/mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    LocalStrategy,
    JwtStrategy,
    MailService,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginValidationMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
