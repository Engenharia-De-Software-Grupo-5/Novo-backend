import 'reflect-metadata';
import { UppercaseGlobalPipe } from 'src/common/pipes/uppercase-global.pipe';

describe('UppercaseGlobalPipe', () => {
  afterEach(() => jest.restoreAllMocks());

  it('should uppercase only string-typed properties and ignore uuid', () => {
    const pipe = new UppercaseGlobalPipe();

    // mock da metadata
    jest.spyOn(Reflect, 'getMetadata').mockImplementation((key: any, _proto: any, prop: any) => {
      if (key === 'skipUppercase') return false;
      if (key === 'design:type') {
        // só "name" é string, "age" não
        if (prop === 'name') return String;
        return Number;
      }
      return undefined;
    });

    const input = {
      id: '550e8400-e29b-41d4-a716-446655440000', // uuid -> não mexe
      name: 'maria',
      age: 20,
    };

    const out = pipe.transform(input, { type: 'body', metatype: class Dummy {} as any } as any);

    expect(out).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'MARIA',
      age: 20,
    });
  });

  it('should skip property when skipUppercase metadata is true', () => {
    const pipe = new UppercaseGlobalPipe();

    jest.spyOn(Reflect, 'getMetadata').mockImplementation((key: any, _proto: any, prop: any) => {
      if (key === 'skipUppercase') return prop === 'name';
      if (key === 'design:type') return String;
      return undefined;
    });

    const input = { name: 'joao' };
    const out = pipe.transform(input, { type: 'body', metatype: class Dummy {} as any } as any);

    expect(out).toEqual({ name: 'joao' });
  });
});