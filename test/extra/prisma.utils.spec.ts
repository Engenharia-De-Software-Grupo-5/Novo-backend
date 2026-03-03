import { buildDynamicWhere } from 'src/contracts/pagination/prisma.utils';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';

describe('buildDynamicWhere', () => {
  it('should return fixedWhere when no filters are provided', () => {
    const dto = { columnName: [], content: [] } as PaginationDto;

    expect(buildDynamicWhere(dto, { deletedAt: null })).toEqual({
      deletedAt: null,
    });
  });

  it('should iterate using min length when arrays have different sizes', () => {
    const dto = {
      columnName: ['name', 'email', 'status'],
      content: ['arthur', 'gmail'],
    } as PaginationDto;

    const where = buildDynamicWhere(dto);

    expect(where).toMatchObject({
      name: { contains: 'arthur', mode: 'insensitive' },
      email: { contains: 'gmail', mode: 'insensitive' },
    });
    expect((where as any).status).toBeUndefined();
  });

  it('should ignore empty column or empty value', () => {
    const dto = {
      columnName: ['name', '', 'email'],
      content: ['', 'x', ''],
    } as PaginationDto;

    const where = buildDynamicWhere(dto);

    expect(where).toEqual({});
  });

  it('should apply custom mapping when provided', () => {
    const dto = {
      columnName: ['q'],
      content: ['abc'],
    } as PaginationDto;

    const where = buildDynamicWhere(dto, {}, {
      customMappings: {
        q: (v: string) => ({
          OR: [
            { name: { contains: v, mode: 'insensitive' } },
            { email: { contains: v, mode: 'insensitive' } },
          ],
        }),
      },
    });

    expect(where).toEqual({
      OR: [
        { name: { contains: 'abc', mode: 'insensitive' } },
        { email: { contains: 'abc', mode: 'insensitive' } },
      ],
    });
  });

  it('should set equals for UUID fields when uuid is valid, and ignore invalid uuid', () => {
    const validUuid = '11111111-1111-1111-1111-111111111111';

    const dto = {
      columnName: ['id', 'userId'],
      content: [validUuid, 'not-a-uuid'],
    } as PaginationDto;

    const where = buildDynamicWhere(dto);

    expect(where).toEqual({
      id: { equals: validUuid },
    });
    expect((where as any).userId).toBeUndefined();
  });

  it('should uppercase enums and use equals', () => {
    const dto = {
      columnName: ['status'],
      content: ['ativo'],
    } as PaginationDto;

    const where = buildDynamicWhere(dto, {}, { enumFields: ['status'] });

    expect(where).toEqual({
      status: { equals: 'ATIVO' },
    });
  });

  it('should parse booleans and ignore unknown boolean values', () => {
    const dto = {
      columnName: ['isActive', 'isPaid', 'isBlocked'],
      content: ['SIM', 'não', 'maybe'],
    } as PaginationDto;

    const where = buildDynamicWhere(dto, {}, {
      booleanFields: ['isActive', 'isPaid', 'isBlocked'],
    });

    expect(where).toEqual({
      isActive: { equals: true },
      isPaid: { equals: false },
    });
    expect((where as any).isBlocked).toBeUndefined();
  });

  it('should parse numbers and ignore NaN', () => {
    const dto = {
      columnName: ['amount', 'floor'],
      content: ['10.5', 'abc'],
    } as PaginationDto;

    const where = buildDynamicWhere(dto, {}, { numberFields: ['amount', 'floor'] });

    expect(where).toEqual({
      amount: { equals: 10.5 },
    });
    expect((where as any).floor).toBeUndefined();
  });

  it('should create date range (gte/lte) for valid dates and ignore invalid date formats', () => {
    const dto = {
      columnName: ['createdAt', 'updatedAt'],
      content: [
        '2026-02-10',      
        '2026-02-31abc',  
      ],
    } as PaginationDto;

    const where = buildDynamicWhere(dto, {}, { dateFields: ['createdAt', 'updatedAt'] });

    expect((where as any).createdAt).toHaveProperty('gte');
    expect((where as any).createdAt).toHaveProperty('lte');
    expect((where as any).updatedAt).toBeUndefined();
  });

  it('should fallback to contains insensitive for default string fields', () => {
    const dto = {
      columnName: ['name'],
      content: ['Moratta'],
    } as PaginationDto;

    const where = buildDynamicWhere(dto);

    expect(where).toEqual({
      name: { contains: 'Moratta', mode: 'insensitive' },
    });
  });
});