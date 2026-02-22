import { NotFoundException } from '@nestjs/common';
import { PropertyDocumentsRepository } from 'src/repositories/condominiums/property-documents.repository';

describe('PropertyDocumentsRepository', () => {
  const prisma = {
    properties: { findFirst: jest.fn() },
    propertyDocuments: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new PropertyDocumentsRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('list should throw when property is not owned', async () => {
    prisma.properties.findFirst.mockResolvedValue(null);
    await expect(repo.list('c1', 'p1')).rejects.toThrow(
      new NotFoundException('Property not found.'),
    );
  });

  it('create should ignore condominiumId in payload and create document', async () => {
    prisma.propertyDocuments.create.mockResolvedValue({ id: 'd1' });
    await repo.create({
      condominiumId: 'c1',
      propertyId: 'p1',
      objectName: 'o',
      originalName: 'n',
      mimeType: 'application/pdf',
      extension: 'pdf',
      size: 10,
    });

    expect(prisma.propertyDocuments.create).toHaveBeenCalledWith({
      data: {
        propertyId: 'p1',
        objectName: 'o',
        originalName: 'n',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 10,
      },
    });
  });

  it('softDelete should set deletedAt', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1', condominiumId: 'c1' });
    prisma.propertyDocuments.findFirst.mockResolvedValue({ id: 'd1' });
    prisma.propertyDocuments.update.mockResolvedValue({ id: 'd1' });

    await repo.softDelete('c1', 'p1', 'd1');
    expect(prisma.propertyDocuments.update).toHaveBeenCalledWith({
      where: { id: 'd1' },
      data: { deletedAt: expect.any(Date) },
    });
  });
});