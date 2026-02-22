import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/services/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-auth') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'userLogin' });
  }

  validate(userLogin: string, password: string) {
    return this.authService.validateUser(userLogin, password);
  }
}
