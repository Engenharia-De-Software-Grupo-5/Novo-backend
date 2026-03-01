import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeContractsController } from 'src/controllers/employees/employee-contracts.controller';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PrismaService } from 'src/common/database/prisma.service';

describe('EmployeeContractsController', () => {
  let controller: EmployeeContractsController;
  let service: jest.Mocked<EmployeeContractsService>;

  beforeEach(async () => {
    const moduleRef = Test.createTestingModule({
      controllers: [EmployeeContractsController],
      providers: [
        {
          provide: EmployeeContractsService,
          useValue: {
            upload: jest.fn(),
            list: jest.fn(),
            findOne: jest.fn(),
            getDownloadUrl: jest.fn(),
            remove: jest.fn(),
          },
        },

        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    });

    moduleRef.overrideGuard(RolesGuard).useValue({
      canActivate: jest.fn().mockReturnValue(true),
    });

    const module: TestingModule = await moduleRef.compile();

    controller = module.get(EmployeeContractsController);
    service = module.get(EmployeeContractsService) as any;
  });

  it('upload should call service.upload', async () => {
  service.upload.mockResolvedValue({ id: 'ct1' } as any);
  const file = {} as any;

  const res = await controller.upload('c1', 'e1', file);

  expect(service.upload).toHaveBeenCalledWith('e1', 'c1', file);
  expect(res).toEqual({ id: 'ct1' });
});

  it('list should call service.list', async () => {
    service.list.mockResolvedValue([{ id: 'ct1' }] as any);

    const res = await controller.list('c1', 'e1');

    expect(service.list).toHaveBeenCalledWith('c1', 'e1');
    expect(res).toEqual([{ id: 'ct1' }]);
  });

  it('findOne should call service.findOne', async () => {
    service.findOne.mockResolvedValue({ id: 'ct1' } as any);

    const res = await controller.findOne('c1', 'e1', 'ct1');

    expect(service.findOne).toHaveBeenCalledWith('c1', 'e1', 'ct1');
    expect(res).toEqual({ id: 'ct1' });
  });

  it('download should call service.getDownloadUrl', async () => {
    service.getDownloadUrl.mockResolvedValue({ url: 'signed' } as any);

    const res = await controller.download('c1', 'e1', 'ct1');

    expect(service.getDownloadUrl).toHaveBeenCalledWith('c1', 'e1', 'ct1');
    expect(res).toEqual({ url: 'signed' });
  });

  it('remove should call service.remove', async () => {
    service.remove.mockResolvedValue(undefined as any);

    await controller.remove('c1', 'e1', 'ct1');

    expect(service.remove).toHaveBeenCalledWith('c1', 'e1', 'ct1');
  });
});