import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload, LoginResponse } from 'src/contracts/auth';
import { AuthRepository } from 'src/repositories/auth/auth.repository';
import * as bcrypt from 'bcrypt';
import { AuthDataModel } from 'src/contracts/auth/auth-data.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  login(user: AuthDataModel): LoginResponse {
    console.log(user);
    const payload: AuthPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isAdminMaster: user.isAdminMaster,
      permission: user.accesses.map((access) => access.permission),
      condominium: user.accesses.map((access) => access.condominium),
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
      name: user.name,
    };
  }

  async validateUser(
    userLogin: string,
    recievedPassword: string,
  ): Promise<AuthDataModel> {
    let user: AuthDataModel | null;
    user = await this.authRepository.getUserByEmail(userLogin);
    if (user == null)
      throw new UnauthorizedException('Incorrect email and/or password.');

    const isMatch = await bcrypt.compare(recievedPassword, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Incorrect email and/or password.');

    return { ...user, password: undefined };
  }

  async passwordResetEmail(email: string): Promise<string> {
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await this.authRepository.getUserIdByEmail(email);
    if (!user) throw new UnauthorizedException('User not found.');

    await this.authRepository.updateUserPassword(user, hashedPassword);

    return newPassword;
  }
}
