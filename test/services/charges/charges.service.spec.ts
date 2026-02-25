import { Test, TestingModule } from '@nestjs/testing';

import { ChargesService } from 'src/services/charges/charges.service';
import { ChargesRepository } from 'src/repositories/charges/charge.repository';

describe('ChargesService', () => {
  let service: ChargesService;
  let repo: jest.Mocked<ChargesRepository>;

  const mockRepo = {
    create: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargesService,
        { provide: ChargesRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(ChargesService);
    repo = module.get(ChargesRepository);

    jest.clearAllMocks();
  });

  it('create should call repo.create(dto)', async () => {
    repo.create.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.create({} as any);

    expect(repo.create).toHaveBeenCalledWith({});
    expect(res).toEqual({ id: 'c1' });
  });

  it('list should call repo.list(params)', async () => {
    repo.list.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await service.list({ tenantId: 't1' } as any);

    expect(repo.list).toHaveBeenCalledWith({ tenantId: 't1' });
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('findOne should call repo.findOne(chargeId)', async () => {
    repo.findOne.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.findOne('c1');

    expect(repo.findOne).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });

  it('update should call repo.update(chargeId, dto)', async () => {
    repo.update.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.update('c1', { status: 'X' } as any);

    expect(repo.update).toHaveBeenCalledWith('c1', { status: 'X' });
    expect(res).toEqual({ id: 'c1' });
  });

  it('cancel should call repo.cancel(chargeId)', async () => {
    repo.cancel.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.cancel('c1');

    expect(repo.cancel).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });

  it('remove should soft delete and return message', async () => {
    repo.softDelete.mockResolvedValue(undefined as any);

    const res = await service.remove('c1');

    expect(repo.softDelete).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ message: 'Charge removed successfully.' });
  });
});