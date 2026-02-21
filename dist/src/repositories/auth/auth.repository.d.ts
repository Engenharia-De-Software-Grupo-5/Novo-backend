import { PrismaService } from 'src/common/database/prisma.service';
import { AuthDataModel } from 'src/contracts/auth/auth-data.model';
export declare class AuthRepository {
    private prisma;
    constructor(prisma: PrismaService);
    getUserByEmailOrCpf(userLogin: string): Promise<AuthDataModel | null>;
    getUserByEmail(email: string): Promise<string | undefined>;
    updateUserPassword(id: string, hashedPassword: string): Promise<void>;
}
