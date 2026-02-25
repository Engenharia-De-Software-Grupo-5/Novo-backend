import { Test, TestingModule } from '@nestjs/testing';

import { ContractTemplateController } from 'src/controllers/contract.templates/contract.template.controller';
import { ContractTemplateService } from 'src/services/contract.templates/contract.template.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('ContractTemplateController', () => {
  let controller: ContractTemplateController;
  let service: jest.Mocked<ContractTemplateService>;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractTemplateController],
      providers: [{ provide: ContractTemplateService, useValue: mockService }],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ContractTemplateController);
    service = module.get(ContractTemplateService);
  });

  it('getAll should call service.getAll(name?)', async () => {
    service.getAll.mockResolvedValue([{ id: 't1' }] as any);

    const res = await controller.getAll('abc');

    expect(service.getAll).toHaveBeenCalledWith('abc');
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should call service.getById(id)', async () => {
    service.getById.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.getById('t1');

    expect(service.getById).toHaveBeenCalledWith('t1');
    expect(res).toEqual({ id: 't1' });
  });

  it('create should call service.create(dto)', async () => {
    service.create.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.create({ name: 'X' } as any);

    expect(service.create).toHaveBeenCalledWith({ name: 'X' });
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call service.update(id, dto)', async () => {
    service.update.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.update('t1', { name: 'Y' } as any);

    expect(service.update).toHaveBeenCalledWith('t1', { name: 'Y' });
    expect(res).toEqual({ id: 't1' });
  });

  it('delete should call service.delete(id)', async () => {
    service.delete.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.delete('t1');

    expect(service.delete).toHaveBeenCalledWith('t1');
    expect(res).toEqual({ id: 't1' });
  });
});