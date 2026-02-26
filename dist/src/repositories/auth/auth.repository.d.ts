import { PrismaService } from 'src/common/database/prisma.service';
import { AuthDataModel } from 'src/contracts/auth/auth-data.model';
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserByEmail(userLogin: string): Promise<AuthDataModel | null>;
    getUserIdByEmail(email: string): Promise<string | undefined>;
    updateUserPassword(id: string, hashedPassword: string): Promise<void>;
}
