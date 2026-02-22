import 'reflect-metadata';
import { ArgumentMetadata } from '@nestjs/common';
import { UppercaseGlobalPipe } from '../../src/common/pipes/uppercase-global.pipe';

class DummyDto {
  name!: string;
  uuid!: string;
  count!: number;
  skipped!: string;
}

describe('UppercaseGlobalPipe', () => {
  let pipe: UppercaseGlobalPipe;

  beforeEach(() => {
    pipe = new UppercaseGlobalPipe();

    Reflect.defineMetadata('design:type', String, DummyDto.prototype, 'name');
    Reflect.defineMetadata('design:type', String, DummyDto.prototype, 'uuid');
    Reflect.defineMetadata('design:type', Number, DummyDto.prototype, 'count');
    Reflect.defineMetadata('design:type', String, DummyDto.prototype, 'skipped');

    Reflect.defineMetadata('skipUppercase', true, DummyDto.prototype, 'skipped');
  });

  it('should return value as-is when it is not an object', () => {
    const meta = { metatype: DummyDto } as ArgumentMetadata;

    expect(pipe.transform('abc', meta)).toBe('abc');
    expect(pipe.transform(123, meta)).toBe(123);
    expect(pipe.transform(null as any, meta)).toBeNull();
  });

  it('should uppercase only string properties (and not UUIDs or skipped properties)', () => {
    const meta = { metatype: DummyDto } as ArgumentMetadata;

    const input = {
      name: 'john doe',
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      count: 10,
      skipped: 'should not change',
    };

    const out = pipe.transform({ ...input }, meta);

    expect(out.name).toBe('JOHN DOE');
    expect(out.uuid).toBe(input.uuid);
    expect(out.count).toBe(10);
    expect(out.skipped).toBe('should not change');
  });

  it('should ignore properties whose design:type is not String', () => {
    const meta = { metatype: DummyDto } as ArgumentMetadata;

    const input = { count: '10' };
    const out = pipe.transform({ ...input }, meta);

    expect(out.count).toBe('10');
  });
});