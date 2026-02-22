// import { Test, TestingModule } from '@nestjs/testing';
// import {
//   NotFoundException,
//   UnsupportedMediaTypeException,
//   ConflictException,
// } from '@nestjs/common';

// import { MinioClientService } from 'src/services/tools/minio-client.service';
// import { ContractService } from 'src/services/contracts/contract.service';
// import { ContractRepository } from 'src/repositories/contracts/contract.repository';

// describe('ContractService', () => {
//   let service: ContractService;
//   let repo: jest.Mocked<ContractRepository>;
//   let minio: jest.Mocked<MinioClientService>;

//   const mockRepo = (): jest.Mocked<ContractRepository> =>
//     ({
//       create: jest.fn(),
//       list: jest.fn(),
//       getById: jest.fn(),
//       softDelete: jest.fn(),

//       linkLease: jest.fn(),
//       unlinkLease: jest.fn(),
//       listByTenant: jest.fn(),
//       listByProperty: jest.fn(),
//     }) as any;

//   const mockMinio = (): jest.Mocked<MinioClientService> =>
//     ({
//       uploadFile: jest.fn(),
//       getFileUrl: jest.fn(),
//       deleteFile: jest.fn(),
//     }) as any;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ContractService,
//         { provide: ContractRepository, useFactory: mockRepo },
//         { provide: MinioClientService, useFactory: mockMinio },
//       ],
//     }).compile();

//     service = module.get(ContractService);
//     repo = module.get(ContractRepository);
//     minio = module.get(MinioClientService);
//   });

//   it('should upload contract (happy path)', async () => {
//     minio.uploadFile.mockResolvedValue({
//       fileName: 'contracts/obj.pdf',
//     } as any);
//     repo.create.mockResolvedValue({ id: 'c-1' } as any);

//     const file = {
//       originalname: 'contrato.pdf',
//       mimetype: 'application/pdf',
//       size: 123,
//       buffer: Buffer.from('x'),
//     } as any;

//     const res = await service.upload(file);

//     expect(minio.uploadFile).toHaveBeenCalledWith(
//       file,
//       ['pdf'],
//       expect.stringMatching(/^contracts\/.+\.pdf$/),
//     );

//     expect(repo.create).toHaveBeenCalledWith(
//       expect.objectContaining({
//         objectName: 'contracts/obj.pdf',
//         originalName: 'contrato.pdf',
//         mimeType: 'application/pdf',
//         extension: 'pdf',
//         size: 123,
//       }),
//     );

//     expect(res).toEqual({ id: 'c-1' });
//   });

//   it('should reject non-pdf upload', async () => {
//     const file = {
//       originalname: 'contrato.png',
//       mimetype: 'image/png',
//       size: 1,
//       buffer: Buffer.from('x'),
//     } as any;

//     await expect(service.upload(file)).rejects.toBeInstanceOf(
//       UnsupportedMediaTypeException,
//     );
//     expect(minio.uploadFile).not.toHaveBeenCalled();
//     expect(repo.create).not.toHaveBeenCalled();
//   });

//   it('should list contracts (no filter)', async () => {
//     repo.list.mockResolvedValue([{ id: 'c-1' }] as any);

//     const res = await service.list();

//     expect(repo.list).toHaveBeenCalledWith({ tenantCpf: undefined });
//     expect(res).toEqual([{ id: 'c-1' }]);
//   });

//   it('should list contracts (filtered by tenantCpf)', async () => {
//     repo.list.mockResolvedValue([{ id: 'c-2' }] as any);

//     const res = await service.list('11111111111');

//     expect(repo.list).toHaveBeenCalledWith({ tenantCpf: '11111111111' });
//     expect(res).toEqual([{ id: 'c-2' }]);
//   });

//   it('should findOne include url', async () => {
//     repo.getById.mockResolvedValue({ id: 'c-1', objectName: 'obj' } as any);
//     minio.getFileUrl.mockResolvedValue('http://url');

//     const res = await service.findOne('c-1');

//     expect(repo.getById).toHaveBeenCalledWith('c-1');
//     expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
//     expect(res).toEqual(
//       expect.objectContaining({ id: 'c-1', url: 'http://url' }),
//     );
//   });

//   it('should throw NotFound on findOne when missing', async () => {
//     repo.getById.mockResolvedValue(null as any);
//     await expect(service.findOne('x')).rejects.toBeInstanceOf(
//       NotFoundException,
//     );
//   });

//   it('should get download url', async () => {
//     repo.getById.mockResolvedValue({ id: 'c-1', objectName: 'obj' } as any);
//     minio.getFileUrl.mockResolvedValue('http://download');

//     const res = await service.getDownloadUrl('c-1');

//     expect(res).toEqual({ url: 'http://download' });
//   });

//   it('should remove contract: delete minio best-effort and soft delete', async () => {
//     repo.getById.mockResolvedValue({ id: 'c-1', objectName: 'obj' } as any);
//     minio.deleteFile.mockResolvedValue(undefined as any);
//     repo.softDelete.mockResolvedValue({} as any);

//     await service.remove('c-1');

//     expect(minio.deleteFile).toHaveBeenCalledWith('obj');
//     expect(repo.softDelete).toHaveBeenCalledWith('c-1');
//   });

//   it('should remove even if minio delete fails', async () => {
//     repo.getById.mockResolvedValue({ id: 'c-1', objectName: 'obj' } as any);
//     minio.deleteFile.mockRejectedValue(new Error('fail'));
//     repo.softDelete.mockResolvedValue({} as any);

//     await service.remove('c-1');

//     expect(repo.softDelete).toHaveBeenCalledWith('c-1');
//   });

//   it('should proxy linkLease/unlinkLease', async () => {
//     repo.linkLease.mockResolvedValue({ id: 'l-1' } as any);

//     const linked = await service.linkLease('c-1', 'p-1', 't-1');
//     expect(repo.linkLease).toHaveBeenCalledWith('c-1', 'p-1', 't-1');
//     expect(linked).toEqual({ id: 'l-1' });

//     repo.unlinkLease.mockResolvedValue({} as any);
//     await service.unlinkLease('c-1', 'p-1', 't-1');
//     expect(repo.unlinkLease).toHaveBeenCalledWith('c-1', 'p-1', 't-1');
//   });

//   it('should propagate ConflictException from repo (linkLease)', async () => {
//     repo.linkLease.mockRejectedValue(
//       new ConflictException('Lease link already exists.'),
//     );

//     await expect(service.linkLease('c-1', 'p-1', 't-1')).rejects.toBeInstanceOf(
//       ConflictException,
//     );
//   });

//   it('should listByTenant / listByProperty', async () => {
//     repo.listByTenant.mockResolvedValue([{ id: 'c-1' }] as any);
//     repo.listByProperty.mockResolvedValue([{ id: 'c-2' }] as any);

//     const byTenant = await service.listByTenant('t-1');
//     const byProp = await service.listByProperty('p-1');

//     expect(repo.listByTenant).toHaveBeenCalledWith('t-1');
//     expect(repo.listByProperty).toHaveBeenCalledWith('p-1');

//     expect(byTenant).toEqual([{ id: 'c-1' }]);
//     expect(byProp).toEqual([{ id: 'c-2' }]);
//   });
// });
