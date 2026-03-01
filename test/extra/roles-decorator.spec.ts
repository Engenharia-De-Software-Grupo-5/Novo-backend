import { ROLES_KEY, Roles } from 'src/common/decorators/roles.decorator';


jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    SetMetadata: jest.fn(() => 'decorator-result'),
  };
});

import { SetMetadata } from '@nestjs/common';

describe('Roles decorator', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should export ROLES_KEY = "roles"', () => {
    expect(ROLES_KEY).toBe('roles');
  });

  it('Roles(...) should call SetMetadata with key and roles and return its result', () => {
    const out = Roles('ADMIN', 'MANAGER');

    expect(SetMetadata).toHaveBeenCalledWith('roles', ['ADMIN', 'MANAGER']);
    expect(out).toBe('decorator-result');
  });
});