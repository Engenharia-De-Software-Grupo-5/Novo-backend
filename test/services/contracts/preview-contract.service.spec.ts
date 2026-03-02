import { PreviewContractService } from 'src/services/contracts/preview.contract.service';

describe('PreviewContractService', () => {
  const templateRepo = { getById: jest.fn() };
  const templateEngine = { parse: jest.fn() };
  const generateContract = { execute: jest.fn() };
  const minio = { putPreview: jest.fn(), getPreviewUrl: jest.fn() };

  const service = new PreviewContractService(
    templateRepo as any,
    templateEngine as any,
    generateContract as any,
    minio as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('execute should parse markdown and return previewHtml', async () => {
    templateRepo.getById.mockResolvedValue({ template: '# Hello' });
    templateEngine.parse.mockReturnValue('<p>Hello</p>');

    const res = await service.execute('cond1', {
      contractTemplateId: 't1',
      data: {},
    } as any);

    expect(templateEngine.parse).toHaveBeenCalled();
    expect(res).toHaveProperty('previewHtml');
  });
});