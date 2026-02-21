import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPasswordDto } from 'src/contracts/auth/user-password.dto';
import { UserRepository } from 'src/repositories/auth/user.repository';
import { MailService } from '../tools/mail.service';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly mailService;
    constructor(userRepository: UserRepository, mailService: MailService);
    getAll(): Promise<UserResponse[]>;
    getById(userId: string): Promise<UserResponse>;
    getUserPaginated(data: PaginationDto): Promise<PaginatedResult<UserResponse>>;
    create(userDto: UserDto): Promise<UserResponse>;
    update(userId: string, userDto: UserDto): Promise<UserResponse>;
    updatePassword(userId: string, userPasswordDto: UserPasswordDto): Promise<UserResponse>;
    delete(userId: string): Promise<UserResponse>;
}
