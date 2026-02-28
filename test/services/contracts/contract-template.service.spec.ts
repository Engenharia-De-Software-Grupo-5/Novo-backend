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
    getPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractTemplateService, { provide: ContractTemplateRepository, useValue: mockRepo }],
    }).compile();

    service = module.get(ContractTemplateService);
    repo = module.get(ContractTemplateRepository);

    jest.clearAllMocks();
  });

  it('getAll should forward condominiumId and optional name', async () => {
    repo.getAll.mockResolvedValue([{ id: 't1' }] as any);

    const res = await service.getAll('c1', 'abc');

    expect(repo.getAll).toHaveBeenCalledWith('c1', 'abc');
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should call repo.getById(condominiumId, id)', async () => {
    repo.getById.mockResolvedValue({ id: 't1' } as any);

    const res = await service.getById('c1', 't1');

    expect(repo.getById).toHaveBeenCalledWith('c1', 't1');
    expect(res).toEqual({ id: 't1' });
  });

  it('create should call repo.create(condominiumId, dto)', async () => {
    repo.create.mockResolvedValue({ id: 't1' } as any);

    const res = await service.create('c1', { name: 'X' } as any);

    expect(repo.create).toHaveBeenCalledWith('c1', { name: 'X' });
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call repo.update(condominiumId, id, dto)', async () => {
    repo.update.mockResolvedValue({ id: 't1' } as any);

    const res = await service.update('c1', 't1', { name: 'Y' } as any);

    expect(repo.update).toHaveBeenCalledWith('c1', 't1', { name: 'Y' });
    expect(res).toEqual({ id: 't1' });
  });

  it('delete should call repo.delete(condominiumId, id)', async () => {
    repo.delete.mockResolvedValue({ id: 't1' } as any);

    const res = await service.delete('c1', 't1');

    expect(repo.delete).toHaveBeenCalledWith('c1', 't1');
    expect(res).toEqual({ id: 't1' });
  });
});