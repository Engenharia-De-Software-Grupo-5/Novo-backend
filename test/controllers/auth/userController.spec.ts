import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'src/controllers/auth/user.controller';
import { UserService } from 'src/services/auth/user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const createServiceMock = (): jest.Mocked<UserService> =>
    ({
      getAll: jest.fn(),
      getById: jest.fn(),
      getUserPaginated: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
      delete: jest.fn(),
    }) as any;

  const guardMock = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useFactory: createServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(guardMock)
      .overrideGuard(RolesGuard)
      .useValue(guardMock);

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should get all users', async () => {
    service.getAll.mockResolvedValue([{ id: 'u-1' }] as any);

    const res = await controller.getAll();

    expect(service.getAll).toHaveBeenCalled();
    expect(res).toEqual([{ id: 'u-1' }]);
  });

  it('should get user by id', async () => {
    service.getById.mockResolvedValue({ id: 'u-1' } as any);

    const res = await controller.getById('u-1');

    expect(service.getById).toHaveBeenCalledWith('u-1');
    expect(res).toEqual({ id: 'u-1' });
  });

  it('should create user', async () => {
    service.create.mockResolvedValue({ id: 'u-1' } as any);

    const dto = { name: 'A', email: 'a@a.com', permission: 'ADMIN' };

    const res = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ id: 'u-1' });
  });

  it('should update user', async () => {
    service.update.mockResolvedValue({ id: 'u-1' } as any);

    const dto = { name: 'B' };

    const res = await controller.update('u-1', dto as any);

    expect(service.update).toHaveBeenCalledWith('u-1', dto);
    expect(res).toEqual({ id: 'u-1' });
  });

  it('should update user password', async () => {
    service.updatePassword.mockResolvedValue({ id: 'u-1' } as any);

    const dto = { oldPassword: 'old', newPassword: 'new' };

    const res = await controller.updatePassword('u-1', dto as any);

    expect(service.updatePassword).toHaveBeenCalledWith('u-1', dto);
    expect(res).toEqual({ id: 'u-1' });
  });

  it('should delete user', async () => {
    service.delete.mockResolvedValue({ id: 'u-1' } as any);

    const res = await controller.delete('u-1');

    expect(service.delete).toHaveBeenCalledWith('u-1');
    expect(res).toEqual({ id: 'u-1' });
  });
});