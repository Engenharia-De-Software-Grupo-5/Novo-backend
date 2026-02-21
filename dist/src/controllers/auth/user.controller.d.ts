import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPasswordDto } from 'src/contracts/auth/user-password.dto';
import { UserService } from 'src/services/auth/user.service';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAll(): Promise<UserResponse[]>;
    getUserPaginated(data: PaginationDto): Promise<PaginatedResult<UserResponse>>;
    getById(userId: string): Promise<UserResponse>;
    create(dto: UserDto): Promise<UserResponse>;
    update(id: string, dto: UserDto): Promise<UserResponse>;
    updatePassword(id: string, dto: UserPasswordDto): Promise<UserResponse>;
    delete(userId: string): Promise<UserResponse>;
}
