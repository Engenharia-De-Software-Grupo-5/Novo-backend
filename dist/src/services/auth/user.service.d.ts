import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPasswordDto } from 'src/contracts/auth/user-password.dto';
import { UserRepository } from 'src/repositories/auth/user.repository';
import { MailService } from '../tools/mail.service';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { UserPatchDto } from 'src/contracts/auth/user.patch.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly mailService;
    constructor(userRepository: UserRepository, mailService: MailService);
    getAll(condominiumId: string): Promise<UserResponse[]>;
    getById(userId: string, condominiumId: string): Promise<UserResponse>;
    getUserPaginated(data: PaginationDto, condominiumId: string): Promise<PaginatedResult<UserResponse>>;
    create(userDto: UserDto, condominiumId: string): Promise<UserResponse>;
    update(userId: string, userDto: UserPatchDto, condominiumId: string): Promise<UserResponse>;
    updatePassword(userId: string, userPasswordDto: UserPasswordDto): Promise<UserResponse>;
    delete(userId: string, condominiumId: string): Promise<UserResponse>;
}
