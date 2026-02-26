import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPasswordDto } from 'src/contracts/auth/user-password.dto';
import { UserService } from 'src/services/auth/user.service';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { UserPatchDto } from 'src/contracts/auth/user.patch.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAll(condominiumId: string): Promise<UserResponse[]>;
    getUserPaginated(condominiumId: string, data: PaginationDto): Promise<PaginatedResult<UserResponse>>;
    getById(userId: string, condominiumId: string): Promise<UserResponse>;
    create(dto: UserDto, condominiumId: string): Promise<UserResponse>;
    update(id: string, dto: UserPatchDto, condominiumId: string): Promise<UserResponse>;
    updatePassword(id: string, dto: UserPasswordDto): Promise<UserResponse>;
    delete(userId: string, condominiumId: string): Promise<UserResponse>;
}
