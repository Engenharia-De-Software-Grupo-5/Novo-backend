import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { PropertyInspectionsController } from 'src/controllers/condominiums/property-inspections.controller';
import { PropertyInspectionsService } from 'src/services/condominiums/property-inspections.service';

describe('PropertyInspectionsController', () => {
  let controller: PropertyInspectionsController;
  let service: jest.Mocked<PropertyInspectionsService>;

  const mockService = (): jest.Mocked<PropertyInspectionsService> =>
    ({
      upload: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
      getDownloadUrl: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyInspectionsController],
      providers: [{ provide: PropertyInspectionsService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(PropertyInspectionsController);
    service = module.get(PropertyInspectionsService);
  });

  it('should upload inspection and call service', async () => {
    service.upload.mockResolvedValue({ id: 'ins-1' } as any);

    const file = {
      originalname: 'foto.png',
      mimetype: 'image/png',
      size: 1,
      buffer: Buffer.from('x'),
    } as any;

    const res = await controller.upload('cond-1', 'prop-1', file);

    expect(service.upload).toHaveBeenCalledWith('cond-1', 'prop-1', file);
    expect(res).toEqual({ id: 'ins-1' });
  });

  it('should throw BadRequestException when upload has no file', async () => {
    await expect(controller.upload('cond-1', 'prop-1', undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should list inspections', async () => {
    service.list.mockResolvedValue([{ id: 'ins-1' }] as any);

    const res = await controller.list('cond-1', 'prop-1');

    expect(service.list).toHaveBeenCalledWith('cond-1', 'prop-1');
    expect(res).toEqual([{ id: 'ins-1' }]);
  });

  it('should find inspection details', async () => {
    service.findOne.mockResolvedValue({ id: 'ins-1', url: 'http://x' } as any);

    const res = await controller.findOne('cond-1', 'prop-1', 'ins-1');

    expect(service.findOne).toHaveBeenCalledWith('cond-1', 'prop-1', 'ins-1');
    expect(res).toEqual({ id: 'ins-1', url: 'http://x' });
  });

  it('should get download url', async () => {
    service.getDownloadUrl.mockResolvedValue({ url: 'http://x' } as any);

    const res = await controller.download('cond-1', 'prop-1', 'ins-1');

    expect(service.getDownloadUrl).toHaveBeenCalledWith('cond-1', 'prop-1', 'ins-1');
    expect(res).toEqual({ url: 'http://x' });
  });

  it('should remove inspection (no content)', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('cond-1', 'prop-1', 'ins-1');

    expect(service.remove).toHaveBeenCalledWith('cond-1', 'prop-1', 'ins-1');
    expect(res).toBeUndefined();
  });

  it('should propagate NotFoundException', async () => {
    service.list.mockRejectedValue(new NotFoundException('x'));
    await expect(controller.list('cond-1', 'prop-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});