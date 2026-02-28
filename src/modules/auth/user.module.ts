import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/auth/user.controller';
import { UserRepository } from 'src/repositories/auth/user.repository';
import { UserService } from 'src/services/auth/user.service';
import { MailService } from 'src/services/tools/mail.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, MailService],
  exports: [UserService]
})
export class UserModule {}
