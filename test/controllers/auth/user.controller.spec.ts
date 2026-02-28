import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from 'src/controllers/auth/user.controller';
import { UserService } from 'src/services/auth/user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const mockService = {
    getAll: jest.fn(),
    getUserPaginated: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updatePassword: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockService }],
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  it('getAll should call userService.getAll(condominiumId)', async () => {
    service.getAll.mockResolvedValue([{ id: 'u1' }] as any);

    const res = await controller.getAll('c1');

    expect(service.getAll).toHaveBeenCalledWith('c1');
    expect(res).toEqual([{ id: 'u1' }]);
  });

  it('getUserPaginated should call userService.getUserPaginated(data, condominiumId)', async () => {
    const page: any = { items: [], meta: { total: 0 } };
    service.getUserPaginated.mockResolvedValue(page);

    const res = await controller.getUserPaginated('c1', { page: 1, limit: 10 } as any);

    expect(service.getUserPaginated).toHaveBeenCalledWith({ page: 1, limit: 10 }, 'c1');
    expect(res).toBe(page);
  });

  it('getById should call userService.getById(userId, condominiumId)', async () => {
    service.getById.mockResolvedValue({ id: 'u1' } as any);

    const res = await controller.getById('u1', 'c1');

    expect(service.getById).toHaveBeenCalledWith('u1', 'c1');
    expect(res).toEqual({ id: 'u1' });
  });

  it('create should call userService.create(dto, condominiumId)', async () => {
    service.create.mockResolvedValue({ id: 'u1' } as any);

    const res = await controller.create({ email: 'a@b.com' } as any, 'c1');

    expect(service.create).toHaveBeenCalledWith({ email: 'a@b.com' }, 'c1');
    expect(res).toEqual({ id: 'u1' });
  });

  it('update should call userService.update(id, dto, condominiumId)', async () => {
    service.update.mockResolvedValue({ id: 'u1' } as any);

    const res = await controller.update('u1', { name: 'X' } as any, 'c1');

    expect(service.update).toHaveBeenCalledWith('u1', { name: 'X' }, 'c1');
    expect(res).toEqual({ id: 'u1' });
  });

  it('updatePassword should call userService.updatePassword(id, dto)', async () => {
    service.updatePassword.mockResolvedValue({ id: 'u1' } as any);

    const res = await controller.updatePassword('u1', { oldPassword: 'a', newPassword: 'b' } as any);

    expect(service.updatePassword).toHaveBeenCalledWith('u1', { oldPassword: 'a', newPassword: 'b' });
    expect(res).toEqual({ id: 'u1' });
  });

  it('delete should call userService.delete(userId, condominiumId)', async () => {
    service.delete.mockResolvedValue({ id: 'u1' } as any);

    const res = await controller.delete('u1', 'c1');

    expect(service.delete).toHaveBeenCalledWith('u1', 'c1');
    expect(res).toEqual({ id: 'u1' });
  });
});