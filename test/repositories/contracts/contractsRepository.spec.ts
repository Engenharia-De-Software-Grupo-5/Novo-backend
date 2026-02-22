import { ConflictException, NotFoundException } from '@nestjs/common';
import { ContractsRepository } from 'src/repositories/contracts/contract.repository';

describe('ContractsRepository', () => {
  const prisma = {
    contracts: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    properties: { findFirst: jest.fn() },
    tenants: { findFirst: jest.fn() },
    propertyTenantContractLinks: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  } as any;

  const repo = new ContractsRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('assertContract should throw when not found', async () => {
    prisma.contracts.findFirst.mockResolvedValue(null);
    await expect(repo.assertContract('c1')).rejects.toThrow(
      new NotFoundException('Contract not found.'),
    );
  });

  it('list should filter by tenantCpf when provided', async () => {
    prisma.contracts.findMany.mockResolvedValue([]);
    await repo.list({ tenantCpf: '123' });
    expect(prisma.contracts.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
          leases: {
            some: {
              tenant: { cpf: '123', deletedAt: null },
            },
          },
        }),
      }),
    );
  });

  it('linkLease should throw ConflictException when prisma returns P2002', async () => {
    prisma.contracts.findFirst.mockResolvedValue({ id: 'c1' });
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' });
    prisma.propertyTenantContractLinks.create.mockRejectedValue({ code: 'P2002' });

    await expect(repo.linkLease('c1', 'p1', 't1')).rejects.toThrow(
      new ConflictException('Lease link already exists.'),
    );
  });

  it('unlinkLease should throw when link not found', async () => {
    prisma.contracts.findFirst.mockResolvedValue({ id: 'c1' });
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' });
    prisma.propertyTenantContractLinks.findFirst.mockResolvedValue(null);

    await expect(repo.unlinkLease('c1', 'p1', 't1')).rejects.toThrow(
      new NotFoundException('Lease link not found.'),
    );
  });
});