import { NotFoundException } from '@nestjs/common';

jest.mock('marked', () => ({
  parse: jest.fn(() => '<p>HTML</p>'),
}));

import { PreviewContractService } from 'src/services/contracts/preview.contract.service';

describe('PreviewContractService', () => {
  const templateRepo = {
    getById: jest.fn(),
  };

  const templateEngine = {
    parse: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException when template not found', async () => {
    templateRepo.getById.mockResolvedValue(null);

    const service = new PreviewContractService(templateRepo as any, templateEngine as any);

    await expect(
      service.execute({ templateId: 't1', data: {} } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should use template.template when editedMarkdown not provided', async () => {
    templateRepo.getById.mockResolvedValue({ template: 'Hello {{name}}' });
    templateEngine.parse.mockReturnValue('Hello Arthur');

    const service = new PreviewContractService(templateRepo as any, templateEngine as any);

    const res = await service.execute({
      templateId: 't1',
      data: { name: 'Arthur' },
    } as any);

    expect(templateRepo.getById).toHaveBeenCalledWith('t1');
    expect(templateEngine.parse).toHaveBeenCalledWith('Hello {{name}}', { name: 'Arthur' });
    expect(res).toEqual({ previewHtml: '<p>HTML</p>' });
  });

  it('should use editedMarkdown when provided', async () => {
    templateRepo.getById.mockResolvedValue({ template: 'IGNORE' });
    templateEngine.parse.mockReturnValue('Edited Result');

    const service = new PreviewContractService(templateRepo as any, templateEngine as any);

    const res = await service.execute({
      templateId: 't1',
      editedMarkdown: 'Custom {{x}}',
      data: { x: 'ok' },
    } as any);

    expect(templateEngine.parse).toHaveBeenCalledWith('Custom {{x}}', { x: 'ok' });
    expect(res).toEqual({ previewHtml: '<p>HTML</p>' });
  });
});