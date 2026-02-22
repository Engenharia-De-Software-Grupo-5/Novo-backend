import { NotFoundException } from '@nestjs/common';
import { PropertyInspectionsRepository } from 'src/repositories/condominiums/property-inspections.repository';

describe('PropertyInspectionsRepository', () => {
  const prisma = {
    properties: { findFirst: jest.fn() },
    propertyInspections: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new PropertyInspectionsRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('findOne should throw when inspection not found', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyInspections.findFirst.mockResolvedValue(null);

    await expect(repo.findOne('c1', 'p1', 'i1')).rejects.toThrow(
      new NotFoundException('Inspection not found.'),
    );
  });

  it('list should order by createdAt desc', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyInspections.findMany.mockResolvedValue([{ id: 'i1' }]);

    const res = await repo.list('c1', 'p1');
    expect(prisma.propertyInspections.findMany).toHaveBeenCalledWith({
      where: { propertyId: 'p1', deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    expect(res).toEqual([{ id: 'i1' }]);
  });

  it('softDelete should set deletedAt', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyInspections.findFirst.mockResolvedValue({ id: 'i1' });
    prisma.propertyInspections.update.mockResolvedValue({ id: 'i1' });

    await repo.softDelete('c1', 'p1', 'i1');
    expect(prisma.propertyInspections.update).toHaveBeenCalledWith({
      where: { id: 'i1' },
      data: { deletedAt: expect.any(Date) },
    });
  });
});