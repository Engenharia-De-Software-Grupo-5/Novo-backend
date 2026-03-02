import { PrismaService } from 'src/common/database/prisma.service';

describe('PrismaService', () => {
  it('onModuleInit should connect', async () => {
    const prisma = new PrismaService() as any;
    prisma.$connect = jest.fn().mockResolvedValue(undefined);

    await prisma.onModuleInit();

    expect(prisma.$connect).toHaveBeenCalledTimes(1);
  });

  it('onModuleDestroy should disconnect', async () => {
    const prisma = new PrismaService() as any;
    prisma.$disconnect = jest.fn().mockResolvedValue(undefined);

    await prisma.onModuleDestroy();

    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });
});