import { Test, TestingModule } from '@nestjs/testing';

import { ContractTemplateService } from 'src/services/contract.templates/contract.template.service';
import { ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';

describe('ContractTemplateService', () => {
  let service: ContractTemplateService;
  let repo: jest.Mocked<ContractTemplateRepository>;

  const mockRepo = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractTemplateService,
        { provide: ContractTemplateRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(ContractTemplateService);
    repo = module.get(ContractTemplateRepository);

    jest.clearAllMocks();
  });

  it('getAll should forward optional name', async () => {
    repo.getAll.mockResolvedValue([{ id: 't1' }] as any);

    const res = await service.getAll('abc');

    expect(repo.getAll).toHaveBeenCalledWith('abc');
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should call repo.getById', async () => {
    repo.getById.mockResolvedValue({ id: 't1' } as any);

    const res = await service.getById('t1');

    expect(repo.getById).toHaveBeenCalledWith('t1');
    expect(res).toEqual({ id: 't1' });
  });

  it('create should call repo.create', async () => {
    repo.create.mockResolvedValue({ id: 't1' } as any);

    const res = await service.create({ name: 'X' } as any);

    expect(repo.create).toHaveBeenCalledWith({ name: 'X' });
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call repo.update', async () => {
    repo.update.mockResolvedValue({ id: 't1' } as any);

    const res = await service.update('t1', { name: 'Y' } as any);

    expect(repo.update).toHaveBeenCalledWith('t1', { name: 'Y' });
    expect(res).toEqual({ id: 't1' });
  });

  it('delete should call repo.delete', async () => {
    repo.delete.mockResolvedValue({ id: 't1' } as any);

    const res = await service.delete('t1');

    expect(repo.delete).toHaveBeenCalledWith('t1');
    expect(res).toEqual({ id: 't1' });
  });
});