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
    getPaginated: jest.fn(),
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

  it('getAll should call service.getAll(condominiumId, name?)', async () => {
    service.getAll.mockResolvedValue([{ id: 't1' }] as any);

    const res = await controller.getAll('c1', 'abc');

    expect(service.getAll).toHaveBeenCalledWith('c1', 'abc');
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should call service.getById(condominiumId, id)', async () => {
    service.getById.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.getById('c1', 't1');

    expect(service.getById).toHaveBeenCalledWith('c1', 't1');
    expect(res).toEqual({ id: 't1' });
  });

  it('create should call service.create(condominiumId, dto)', async () => {
    service.create.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.create('c1', { name: 'X' } as any);

    expect(service.create).toHaveBeenCalledWith('c1', { name: 'X' });
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call service.update(condominiumId, id, dto)', async () => {
    service.update.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.update('c1', 't1', { name: 'Y' } as any);

    expect(service.update).toHaveBeenCalledWith('c1', 't1', { name: 'Y' });
    expect(res).toEqual({ id: 't1' });
  });

  it('delete should call service.delete(condominiumId, id)', async () => {
    service.delete.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.delete('c1', 't1');

    expect(service.delete).toHaveBeenCalledWith('c1', 't1');
    expect(res).toEqual({ id: 't1' });
  });
});