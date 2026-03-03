import { NotFoundException } from '@nestjs/common';

import { TenantService } from 'src/services/tenants/tenant.service';

describe('TenantService', () => {
  const repo = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByCpf: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
  };

  const service = new TenantService(repo as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll should call repo.getAll with condId', async () => {
    repo.getAll.mockResolvedValue([{ id: 't1' }]);

    const res = await service.getAll('c1');

    expect(repo.getAll).toHaveBeenCalledWith('c1');
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should throw NotFoundException when not found', async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.getById('c1', 't1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getById should return tenant when found', async () => {
    repo.getById.mockResolvedValue({ id: 't1' });

    const res = await service.getById('c1', 't1');

    expect(repo.getById).toHaveBeenCalledWith('c1', 't1');
    expect(res).toEqual({ id: 't1' });
  });

  it('create should call repo.create with condId and dto', async () => {
    repo.create.mockResolvedValue({ id: 't1' });

    const res = await service.create('c1', { cpf: '123', name: 'A' } as any);

    expect(repo.create).toHaveBeenCalledWith('c1', {
      cpf: '123',
      name: 'A',
    });
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call repo.update with condId, id, dto', async () => {
    repo.update.mockResolvedValue({ id: 't1' });

    const res = await service.update('c1', 't1', { name: 'X' } as any);

    expect(repo.update).toHaveBeenCalledWith('c1', 't1', { name: 'X' });
    expect(res).toEqual({ id: 't1' });
  });

  it('deleteById should throw NotFoundException when tenant not found', async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.deleteById('c1', 't1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deleteById should call repo.deleteById', async () => {
    repo.getById.mockResolvedValue({ id: 't1' });
    repo.deleteById.mockResolvedValue({ id: 't1' });

    const res = await service.deleteById('c1', 't1');

    expect(repo.deleteById).toHaveBeenCalledWith('c1', 't1');
    expect(res).toEqual({ id: 't1' });
  });
});