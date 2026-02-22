import { PrismaService } from '../../src/common/database/prisma.service';

describe('PrismaService', () => {
  it('should call $connect on module init', async () => {
    const prisma = new PrismaService();
    (prisma as any).$connect = jest.fn().mockResolvedValue(undefined);

    await prisma.onModuleInit();

    expect((prisma as any).$connect).toHaveBeenCalled();
  });

  it('should call $disconnect on module destroy', async () => {
    const prisma = new PrismaService();
    (prisma as any).$disconnect = jest.fn().mockResolvedValue(undefined);

    await prisma.onModuleDestroy();

    expect((prisma as any).$disconnect).toHaveBeenCalled();
  });
});