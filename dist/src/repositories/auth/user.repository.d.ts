import { PrismaService } from 'src/common/database/prisma.service';
import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPatchDto } from 'src/contracts/auth/user.patch.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(condominiumId: string): Promise<UserResponse[]>;
    getById(userId: string): Promise<UserResponse>;
    getUserPaginated(data: PaginationDto): Promise<PaginatedResult<UserResponse>>;
    create(userDto: UserDto, password: string, condominiumId: string): Promise<UserResponse>;
    update(userId: string, userDto: UserPatchDto, condominiumId: string): Promise<UserResponse>;
    updatePassword(userId: string, password: string): Promise<UserResponse>;
    delete(userId: string, condominiumId: string): Promise<UserResponse>;
    getByIdWithPassword(userId: string): Promise<{
        password: string;
    } | null>;
    findByEmail(email: string): Promise<UserResponse>;
}
