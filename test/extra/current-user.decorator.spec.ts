import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ExecutionContext } from '@nestjs/common';

describe('CurrentUser decorator', () => {
  const load = () => {
    jest.resetModules();
    let CurrentUser: any;

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      CurrentUser = require('src/common/decorators/current.user.decorator').CurrentUser;
    });

    return { CurrentUser };
  };

  it('should define route args metadata for the parameter (so Nest can resolve req.user later)', () => {
    const { CurrentUser } = load();

    class DummyController {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handler(_user: any) {
        return true;
      }
    }

    // aplica o decorator no parâmetro 0 do método handler
    CurrentUser()(DummyController.prototype, 'handler', 0);

    const meta = Reflect.getMetadata(ROUTE_ARGS_METADATA, DummyController.prototype.constructor, 'handler');
    expect(meta).toBeDefined();

    // deve existir alguma key de param para o índice 0
    const keys = Object.keys(meta);
    expect(keys.length).toBeGreaterThan(0);

    // pega o primeiro registro e valida estrutura mínima (index / factory)
    const first = meta[keys[0]];
    expect(first).toHaveProperty('index', 0);

    // O Nest guarda uma factory pra resolver o valor no request em runtime.
    // Não chamamos a factory diretamente aqui porque o Nest injeta args internos.
    expect(typeof first.factory).toBe('function');
  });

  it('metadata factory should be callable with an ExecutionContext-like object (returns req.user)', () => {
    const { CurrentUser } = load();

    class DummyController {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handler(_user: any) {
        return true;
      }
    }

    CurrentUser()(DummyController.prototype, 'handler', 0);

    const meta = Reflect.getMetadata(ROUTE_ARGS_METADATA, DummyController.prototype.constructor, 'handler');
    const key = Object.keys(meta)[0];
    const { factory } = meta[key];

    const user = { id: 'u1', email: 'a@a.com' };

    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;

    // a factory do Nest recebe (data, ctx)
    const result = factory(undefined, ctx);

    expect(result).toBe(user);
  });
});