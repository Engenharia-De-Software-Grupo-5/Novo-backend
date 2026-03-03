import { Test, TestingModule } from '@nestjs/testing';
import { ContractController } from 'src/controllers/contracts/contract.controller';
import { ContractService } from 'src/services/contracts/contract.service';
import { PreviewContractService } from 'src/services/contracts/preview.contract.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('ContractController', () => {
  let controller: ContractController;
  let service: jest.Mocked<ContractService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractController],
      providers: [
        {
          provide: ContractService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
          },
        },
        {
          provide: PreviewContractService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .compile();

    controller = module.get(ContractController);
    service = module.get(ContractService) as any;
  });

  it('getAll should call service.getAll', async () => {
    service.getAll.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await controller.getAll('cond1');

    expect(service.getAll).toHaveBeenCalledWith('cond1');
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('getById should call service.getById', async () => {
    service.getById.mockResolvedValue({ id: 'c1' } as any);

    const res = await controller.getById('cond1', 'c1');

    expect(service.getById).toHaveBeenCalledWith('cond1', 'c1');
    expect(res).toEqual({ id: 'c1' });
  });
});