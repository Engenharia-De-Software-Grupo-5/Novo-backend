import { InternalServerErrorException, UnsupportedMediaTypeException } from '@nestjs/common';
import { MinioClientService } from 'src/services/tools/minio-client.service';

describe('MinioClientService', () => {
  const makeService = () => {
    const client = {
      putObject: jest.fn(),
      removeObject: jest.fn(),
      listObjects: jest.fn(),
    };

    const minio = { client } as any;

    const configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'MINIO_BUCKET_NAME') return 'bucket';
        throw new Error(`Missing key: ${key}`);
      }),
      get: jest.fn((key: string) => {
 
        if (key === 'MINIO_ACCESS_KEY') return 'access';
        if (key === 'MINIO_SECRET_KEY') return 'secret';
        return undefined;
      }),
    } as any;

    const service = new MinioClientService(minio, configService);


    (service as any).publicMinioClient = {
      presignedGetObject: jest.fn(),
    };

    return { service, client, publicClient: (service as any).publicMinioClient };
  };

  it('uploadFile should upload when extension is allowed', async () => {
    const { service, client } = makeService();

    client.putObject.mockResolvedValueOnce(undefined);

    const file = {
      originalname: 'contrato.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('abc'),
      size: 3,
    } as any;

    const out = await service.uploadFile(file, ['pdf'], 'meu contrato.pdf');

    expect(client.putObject).toHaveBeenCalledWith(
      'bucket',
      'meu_contrato.pdf',          
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );
    expect(out).toEqual({ fileName: 'meu_contrato.pdf' });
  });

  it('uploadFile should throw UnsupportedMediaTypeException when extension is not allowed', async () => {
    const { service } = makeService();

    const file = {
      originalname: 'virus.exe',
      mimetype: 'application/octet-stream',
      buffer: Buffer.from('abc'),
      size: 3,
    } as any;

    await expect(service.uploadFile(file, ['pdf'], 'x.exe')).rejects.toBeInstanceOf(
      UnsupportedMediaTypeException,
    );
  });

  it('uploadFile should throw InternalServerErrorException when putObject fails', async () => {
    const { service, client } = makeService();

    client.putObject.mockRejectedValueOnce(new Error('fail'));

    const file = {
      originalname: 'contrato.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('abc'),
      size: 3,
    } as any;

    await expect(service.uploadFile(file, ['pdf'], 'contrato.pdf')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('listFiles should map objects into FileInfo[]', async () => {
    const { service, client } = makeService();

    const handlers: Record<string, Function> = {};
    const stream = {
      on: (event: string, cb: any) => {
        handlers[event] = cb;
        return stream;
      },
    };
    client.listObjects.mockReturnValueOnce(stream);

    const promise = service.listFiles();

    handlers.data({ name: 'a.pdf' });
    handlers.data({ name: 'semext' });
    handlers.end();

    await expect(promise).resolves.toEqual([
      { fullName: 'a.pdf', fileName: 'a', extension: 'pdf' },
      { fullName: 'semext', fileName: 'semext', extension: '' },
    ]);
  });

  it('getFileUrl should call publicMinioClient.presignedGetObject', async () => {
    const { service, publicClient } = makeService();
    publicClient.presignedGetObject.mockResolvedValueOnce('signed-url');

    await expect(service.getFileUrl('file.pdf')).resolves.toBe('signed-url');

    expect(publicClient.presignedGetObject).toHaveBeenCalledWith(
      'bucket',
      'file.pdf',
      60 * 60,
    );
  });

  it('deleteFile should call minio.client.removeObject', async () => {
    const { service, client } = makeService();
    client.removeObject.mockResolvedValueOnce(undefined);

    await expect(service.deleteFile('x.pdf')).resolves.toBeUndefined();
    expect(client.removeObject).toHaveBeenCalledWith('bucket', 'x.pdf');
  });

  it('uploadFileBuffer should upload buffer with mimeType', async () => {
    const { service, client } = makeService();
    client.putObject.mockResolvedValueOnce(undefined);

    const buffer = Buffer.from('hello');

    const out = await service.uploadFileBuffer(buffer, 'x.pdf', 'application/pdf');

    expect(client.putObject).toHaveBeenCalledWith(
      'bucket',
      'x.pdf',
      buffer,
      buffer.length,
      { 'Content-Type': 'application/pdf' },
    );
    expect(out).toEqual({ fileName: 'x.pdf' });
  });
});