describe('PrismaService', () => {
  const load = () => {
    jest.resetModules();

  
    jest.doMock('@prisma/client', () => {
      class PrismaClientMock {
        $connect = jest.fn();
        $disconnect = jest.fn();
      }
      return { PrismaClient: PrismaClientMock };
    });

    let PrismaService: any;

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      PrismaService = require('src/common/database/prisma.service').PrismaService;
    });

    return { PrismaService };
  };

  it('onModuleInit should call $connect', async () => {
    const { PrismaService } = load();

    const prisma = new PrismaService();
    await prisma.onModuleInit();

    expect(prisma.$connect).toHaveBeenCalledTimes(1);
  });

  it('onModuleDestroy should call $disconnect', async () => {
    const { PrismaService } = load();

    const prisma = new PrismaService();
    await prisma.onModuleDestroy();

    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });
});