import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPasswordDto } from 'src/contracts/auth/user-password.dto';
import { UserRepository } from 'src/repositories/auth/user.repository';
import * as bcrypt from 'bcrypt';
import { MailService } from '../tools/mail.service';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  getAll(condominiumId: string): Promise<UserResponse[]> {
    return this.userRepository.getAll(condominiumId);
  }

  getById(userId: string, condominiumId: string): Promise<UserResponse> {
    return this.userRepository.getById(userId);
  }

  getUserPaginated(
    data: PaginationDto,
    condominiumId: string,
  ): Promise<PaginatedResult<UserResponse>> {
    return this.userRepository.getUserPaginated(data);
  }

  async create(userDto: UserDto, condominiumId: string): Promise<UserResponse> {
    const existingUser = await this.userRepository.findByEmail(userDto.email);

    if (existingUser) {
      if (
        existingUser.accesses.some(
          (access) => access.condominium.id === condominiumId,
        )
      ) {
        return this.userRepository.update(
          existingUser.id,
          userDto,
          condominiumId,
        );
      }
    } else {
      const newPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await this.userRepository.create(
        userDto,
        hashedPassword,
        condominiumId,
      );
      try {
        this.mailService.sendMail(
          userDto.email,
          'Credentials for your new account',
          `To login, use this email: ${userDto.email}\nYour new password is: ${newPassword}\nPlease change it after your first login.`,
        );
      } catch (error) {
        throw new HttpException(
          'Failed to send email.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return result;
    }
  }

  update(
    userId: string,
    userDto: UserDto,
    condominiumId: string,
  ): Promise<UserResponse> {
    return this.userRepository.update(userId, userDto, condominiumId);
  }

  async updatePassword(
    userId: string,
    userPasswordDto: UserPasswordDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.getByIdWithPassword(userId);
    if (!user) throw new UnauthorizedException('User not found.');

    const isMatch = await bcrypt.compare(
      userPasswordDto.oldPassword,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException();

    const newPassword = await bcrypt.hash(userPasswordDto.newPassword, 10);
    return this.userRepository.updatePassword(userId, newPassword);
  }

  delete(userId: string): Promise<UserResponse> {
    return this.userRepository.delete(userId);
  }
}
