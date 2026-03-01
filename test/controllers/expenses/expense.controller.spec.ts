import { Test, TestingModule } from '@nestjs/testing';

import { ExpenseService } from 'src/services/expenses/expense.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ExpenseController } from 'src/controllers/condominiums/expense.controller';

describe('ExpenseController', () => {
  let controller: ExpenseController;
  let service: jest.Mocked<ExpenseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        {
          provide: ExpenseService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .compile();

    controller = module.get(ExpenseController);
    service = module.get(ExpenseService) as any;
  });

  it('create should call service.create', async () => {
    service.create.mockResolvedValue({ id: 'e1' } as any);

    const dto = { files: [] } as any;

    const res = await controller.create('c1', dto);

    expect(service.create).toHaveBeenCalledWith(dto, 'c1');
    expect(res).toEqual({ id: 'e1' });
  });
});