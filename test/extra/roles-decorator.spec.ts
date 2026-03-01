import 'reflect-metadata';
import { ROLES_KEY, Roles } from 'src/common/decorators/roles.decorator';

describe('Roles decorator', () => {
  it('should set roles metadata on method', () => {
    class Dummy {
      @Roles('admin', 'manager')
      method() {}
    }

    const roles = Reflect.getMetadata(ROLES_KEY, Dummy.prototype.method);
    expect(roles).toEqual(['admin', 'manager']);
  });

  it('should set roles metadata on class', () => {
    @Roles('admin')
    class Dummy {}

    const roles = Reflect.getMetadata(ROLES_KEY, Dummy);
    expect(roles).toEqual(['admin']);
  });
});