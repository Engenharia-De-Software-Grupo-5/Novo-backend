import { PrismaService } from 'src/common/database/prisma.service';
import { UserDto, UserResponse } from 'src/contracts/auth';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
export declare class UserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<UserResponse[]>;
    getById(userId: string): Promise<UserResponse>;
    getUserPaginated(data: PaginationDto): Promise<PaginatedResult<UserResponse>>;
    create(userDto: UserDto, password: string): Promise<UserResponse>;
    update(userId: string, userDto: UserDto): Promise<UserResponse>;
    updatePassword(userId: string, password: string): Promise<UserResponse>;
    delete(userId: string): Promise<UserResponse>;
    getByIdWithPassword(userId: string): Promise<{
        password: string;
    } | null>;
}
