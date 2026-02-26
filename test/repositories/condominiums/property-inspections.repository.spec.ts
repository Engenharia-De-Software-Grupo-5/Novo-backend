import { NotFoundException } from '@nestjs/common';
import { PropertyInspectionsRepository } from 'src/repositories/condominiums/property-inspections.repository';

describe('PropertyInspectionsRepository', () => {
  const prisma = {
    properties: {
      findFirst: jest.fn(),
    },
    propertyInspections: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assertPropertyOwned should throw NotFoundException when property not found', async () => {
    prisma.properties.findFirst.mockResolvedValue(null);

    const repo = new PropertyInspectionsRepository(prisma as any);

    await expect(repo.assertPropertyOwned('c1', 'p1')).rejects.toThrow(
      NotFoundException,
    );

    expect(prisma.properties.findFirst).toHaveBeenCalledWith({
      where: { id: 'p1', condominiumId: 'c1', deletedAt: null },
      select: { id: true, condominiumId: true },
    });
  });

  it('assertPropertyOwned should return property when found', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });

    const repo = new PropertyInspectionsRepository(prisma as any);

    const res = await repo.assertPropertyOwned('c1', 'p1');

    expect(res).toEqual({ id: 'p1', condominiumId: 'c1' });
  });

  it('create should ignore condominiumId and create with remaining payload', async () => {
    prisma.propertyInspections.create.mockResolvedValue({ id: 'i1' } as any);

    const repo = new PropertyInspectionsRepository(prisma as any);

    const res = await repo.create({
      condominiumId: 'c1',
      propertyId: 'p1',
      objectName: 'obj.pdf',
      originalName: 'insp.pdf',
      mimeType: 'application/pdf',
      extension: 'pdf',
      size: 10,
    });

    expect(prisma.propertyInspections.create).toHaveBeenCalledWith({
      data: {
        propertyId: 'p1',
        objectName: 'obj.pdf',
        originalName: 'insp.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 10,
      },
    });

    expect(res).toEqual({ id: 'i1' });
  });

  it('list should assert property owned and list inspections ordered by createdAt desc', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyInspections.findMany.mockResolvedValue([{ id: 'i1' }] as any);

    const repo = new PropertyInspectionsRepository(prisma as any);

    const res = await repo.list('c1', 'p1');

    expect(prisma.properties.findFirst).toHaveBeenCalled(); // assertPropertyOwned
    expect(prisma.propertyInspections.findMany).toHaveBeenCalledWith({
      where: { propertyId: 'p1', deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    expect(res).toEqual([{ id: 'i1' }]);
  });

  it('findOne should throw NotFoundException when inspection not found', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyInspections.findFirst.mockResolvedValue(null);

    const repo = new PropertyInspectionsRepository(prisma as any);

    await expect(repo.findOne('c1', 'p1', 'i1')).rejects.toThrow(NotFoundException);

    expect(prisma.propertyInspections.findFirst).toHaveBeenCalledWith({
      where: { id: 'i1', propertyId: 'p1', deletedAt: null },
    });
  });

  it('findOne should return inspection when found', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyInspections.findFirst.mockResolvedValue({ id: 'i1' } as any);

    const repo = new PropertyInspectionsRepository(prisma as any);

    const res = await repo.findOne('c1', 'p1', 'i1');

    expect(res).toEqual({ id: 'i1' });
  });

  it('softDelete should call findOne then update deletedAt', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyInspections.findFirst.mockResolvedValue({ id: 'i1' } as any);
    prisma.propertyInspections.update.mockResolvedValue({} as any);

    const repo = new PropertyInspectionsRepository(prisma as any);

    const res = await repo.softDelete('c1', 'p1', 'i1');

    expect(prisma.propertyInspections.update).toHaveBeenCalledWith({
      where: { id: 'i1' },
      data: { deletedAt: expect.any(Date) },
    });

    expect(res).toBeUndefined();
  });
});