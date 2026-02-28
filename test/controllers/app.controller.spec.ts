import { NotFoundException } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';

describe('AppController', () => {
  const makeController = () => {
    const appService = {
      getHello: jest.fn().mockReturnValue('Hello World!'),
    };

    const minioService = {
      uploadFile: jest.fn(),
      getFileUrl: jest.fn(),
      deleteFile: jest.fn(),
    };

    const controller = new AppController(appService as any, minioService as any);

    return { controller, appService, minioService };
  };

  it('getHello should return from AppService', () => {
    const { controller, appService } = makeController();
    expect(controller.getHello()).toBe('Hello World!');
    expect(appService.getHello).toHaveBeenCalledTimes(1);
  });

  it('getMe should return mapped user info (not the raw user)', () => {
  const { controller } = makeController();

  const reqUser = {
    sub: '1',
    email: 'test@test.com',
    cpf: '12345678900',
    name: 'Test User',
    permission: [{ id: 'p1', name: 'ADMIN' }],
    condominium: [{ id: 'c1', name: 'C1' }],
  };

  const result = controller.getMe(reqUser as any);

  expect(result).toEqual({
    id: '1',
    email: 'test@test.com',
    cpf: '12345678900',
    name: 'Test User',
    permission: [{ id: 'p1', name: 'ADMIN' }],
    condominium: [{ id: 'c1', name: 'C1' }],
  });
});

  it('uploadFile should throw if file is missing', async () => {
    const { controller } = makeController();
    await expect(controller.uploadFile(undefined as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('uploadFile should call minio.uploadFile(file, allowedExtensions, originalname)', async () => {
    const { controller, minioService } = makeController();

    minioService.uploadFile.mockResolvedValue({ fileName: 'file.pdf' });

    const file = {
      originalname: 'file.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('abc'),
      size: 3,
    } as any;

    const result = await controller.uploadFile(file);

    expect(minioService.uploadFile).toHaveBeenCalledWith(
      file,
      ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'],
      'file.pdf',
    );
    expect(result).toEqual({ fileName: 'file.pdf' });
  });

  it('getFileAccessUrl should return object { url }', async () => {
    const { controller, minioService } = makeController();

    minioService.getFileUrl.mockResolvedValue('signed-url');

    const result = await controller.getFileAccessUrl('file.pdf');

    expect(minioService.getFileUrl).toHaveBeenCalledWith('file.pdf');
    expect(result).toEqual({ url: 'signed-url' });
  });

  it('deleteFile should call minio.deleteFile', async () => {
    const { controller, minioService } = makeController();

    minioService.deleteFile.mockResolvedValue(undefined);

    await controller.deleteFile('file.pdf');

    expect(minioService.deleteFile).toHaveBeenCalledWith('file.pdf');
  });
});