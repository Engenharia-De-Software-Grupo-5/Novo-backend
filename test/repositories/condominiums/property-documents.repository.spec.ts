import { NotFoundException } from '@nestjs/common';
import { PropertyDocumentsRepository } from 'src/repositories/condominiums/property-documents.repository';

describe('PropertyDocumentsRepository', () => {
  const prisma = {
    properties: {
      findFirst: jest.fn(),
    },
    propertyDocuments: {
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

    const repo = new PropertyDocumentsRepository(prisma as any);

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

    const repo = new PropertyDocumentsRepository(prisma as any);

    const res = await repo.assertPropertyOwned('c1', 'p1');

    expect(res).toEqual({ id: 'p1', condominiumId: 'c1' });
  });

  it('create should ignore condominiumId and create with remaining payload', async () => {
    prisma.propertyDocuments.create.mockResolvedValue({ id: 'd1' } as any);

    const repo = new PropertyDocumentsRepository(prisma as any);

    const res = await repo.create({
      condominiumId: 'c1',
      propertyId: 'p1',
      objectName: 'obj.pdf',
      originalName: 'doc.pdf',
      mimeType: 'application/pdf',
      extension: 'pdf',
      size: 10,
    });

    expect(prisma.propertyDocuments.create).toHaveBeenCalledWith({
      data: {
        propertyId: 'p1',
        objectName: 'obj.pdf',
        originalName: 'doc.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 10,
      },
    });

    expect(res).toEqual({ id: 'd1' });
  });

  it('list should assert property owned and list documents ordered by createdAt desc', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyDocuments.findMany.mockResolvedValue([{ id: 'd1' }] as any);

    const repo = new PropertyDocumentsRepository(prisma as any);

    const res = await repo.list('c1', 'p1');

    expect(prisma.properties.findFirst).toHaveBeenCalled(); // assertPropertyOwned
    expect(prisma.propertyDocuments.findMany).toHaveBeenCalledWith({
      where: { propertyId: 'p1', deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    expect(res).toEqual([{ id: 'd1' }]);
  });

  it('findOne should throw NotFoundException when document not found', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyDocuments.findFirst.mockResolvedValue(null);

    const repo = new PropertyDocumentsRepository(prisma as any);

    await expect(repo.findOne('c1', 'p1', 'd1')).rejects.toThrow(
      NotFoundException,
    );

    expect(prisma.propertyDocuments.findFirst).toHaveBeenCalledWith({
      where: { id: 'd1', propertyId: 'p1', deletedAt: null },
    });
  });

  it('findOne should return document when found', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyDocuments.findFirst.mockResolvedValue({ id: 'd1' } as any);

    const repo = new PropertyDocumentsRepository(prisma as any);

    const res = await repo.findOne('c1', 'p1', 'd1');

    expect(res).toEqual({ id: 'd1' });
  });

  it('softDelete should call findOne then update deletedAt', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyDocuments.findFirst.mockResolvedValue({ id: 'd1' } as any);
    prisma.propertyDocuments.update.mockResolvedValue({} as any);

    const repo = new PropertyDocumentsRepository(prisma as any);

    const res = await repo.softDelete('c1', 'p1', 'd1');

    expect(prisma.propertyDocuments.update).toHaveBeenCalledWith({
      where: { id: 'd1' },
      data: { deletedAt: expect.any(Date) },
    });

    expect(res).toBeUndefined(); // método não retorna nada
  });
});