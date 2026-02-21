import 'reflect-metadata';
import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from '../../src/common/decorators/current.user.decorator';
import { SkipUppercase } from '../../src/common/decorators/skip-uppercase.decorator';

describe('Decorators', () => {
  it('CurrentUser should extract request.user from ExecutionContext', () => {
    class TestController {

      test(@CurrentUser() _user: any) {
        return true;
      }
    }

    const meta = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'test');
    expect(meta).toBeDefined();

   
    const firstKey = Object.keys(meta)[0];
    const factory = meta[firstKey].factory;
    expect(typeof factory).toBe('function');

    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { sub: '1' } }),
      }),
    } as unknown as ExecutionContext;

    const user = factory(undefined, ctx);
    expect(user).toEqual({ sub: '1' });
  });

  it('SkipUppercase should define skipUppercase metadata on property', () => {
    class Dto {
      @SkipUppercase()
      name!: string;
    }

    const skip = Reflect.getMetadata('skipUppercase', Dto.prototype, 'name');
    expect(skip).toBe(true);
  });
});