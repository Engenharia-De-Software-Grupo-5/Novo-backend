import { Test, TestingModule } from '@nestjs/testing';
import { ChargesService } from 'src/services/charges/charges.service';
import { ChargeStatus, PaymentMethod } from '@prisma/client';
import { ChargesRepository } from 'src/repositories/charges/charge.repository';

describe('ChargesService', () => {
  let service: ChargesService;
  let repo: jest.Mocked<ChargesRepository>;

  const createRepoMock = (): jest.Mocked<ChargesRepository> => ({
    create: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
    softDelete: jest.fn(),
  } as unknown as jest.Mocked<ChargesRepository>);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargesService,
        { provide: ChargesRepository, useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get(ChargesService);
    repo = module.get(ChargesRepository);
  });

  it('should create charge (happy path)', async () => {
    const dto = {
      tenantId: 't-1',
      propertyId: 'p-1',
      amount: 100,
      dueDate: '2026-03-10',
      paymentMethod: PaymentMethod.PIX,
      fineRate: 2,
      monthlyRate: 1,
    };

    repo.create.mockResolvedValue({
      id: 'c-1',
      amount: 100,
      dueDate: new Date('2026-03-10'),
      fineRate: 2,
      monthlyRate: 1,
      paymentMethod: PaymentMethod.PIX,
      status: ChargeStatus.PENDING,
      tenantId: 't-1',
      propertyId: 'p-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as any);

    const result = await service.create(dto as any);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expect.objectContaining({ id: 'c-1' }));
  });

  it('should list charges', async () => {
    repo.list.mockResolvedValue([{ id: 'c-1' }, { id: 'c-2' }] as any);

    const result = await service.list({
      tenantId: 't-1',
      propertyId: 'p-1',
      status: ChargeStatus.PENDING,
    });

    expect(repo.list).toHaveBeenCalledWith({
      tenantId: 't-1',
      propertyId: 'p-1',
      status: ChargeStatus.PENDING,
    });
    expect(result).toEqual([{ id: 'c-1' }, { id: 'c-2' }]);
  });

  it('should find one charge', async () => {
    repo.findOne.mockResolvedValue({ id: 'c-1' } as any);

    const result = await service.findOne('c-1');

    expect(repo.findOne).toHaveBeenCalledWith('c-1');
    expect(result).toEqual({ id: 'c-1' });
  });

  it('should update charge', async () => {
    repo.update.mockResolvedValue({ id: 'c-1', amount: 200 } as any);

    const result = await service.update('c-1', { amount: 200 } as any);

    expect(repo.update).toHaveBeenCalledWith('c-1', { amount: 200 });
    expect(result).toEqual({ id: 'c-1', amount: 200 });
  });

  it('should cancel charge', async () => {
    repo.cancel.mockResolvedValue({ id: 'c-1', status: ChargeStatus.CANCELED } as any);

    const result = await service.cancel('c-1');

    expect(repo.cancel).toHaveBeenCalledWith('c-1');
    expect(result).toEqual({ id: 'c-1', status: ChargeStatus.CANCELED });
  });

  it('should remove charge (soft delete) and return message', async () => {
    repo.softDelete.mockResolvedValue(undefined as any);

    const result = await service.remove('c-1');

    expect(repo.softDelete).toHaveBeenCalledWith('c-1');
    expect(result).toEqual({ message: 'Charge removed successfully.' });
  });
});