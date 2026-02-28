import { NotFoundException } from '@nestjs/common';

import { GenerateContractService } from 'src/services/tools/generate-contract.service';

describe('GenerateContractService', () => {
  const contractsRepo = {
    getById: jest.fn(),
  };

  const templateEngine = {
    parse: jest.fn(),
  };

  const pdfGenerator = {
    generate: jest.fn(),
  };

  const minio = {
    uploadFileBuffer: jest.fn(),
  };

  const makeService = () =>
    new GenerateContractService(
      contractsRepo as any,
      templateEngine as any,
      pdfGenerator as any,
      minio as any,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException when contract not found', async () => {
    contractsRepo.getById.mockResolvedValue(null);

    const service = makeService();

    await expect(service.execute('c1')).rejects.toThrow(NotFoundException);
    await expect(service.execute('c1')).rejects.toThrow('Contrato não encontrado');
  });

  it('should throw NotFoundException when template missing', async () => {
    contractsRepo.getById.mockResolvedValue({
      contractTemplate: null,
      property: { condominium: { address: {} } },
      tenant: {},
    });

    const service = makeService();

    await expect(service.execute('c1')).rejects.toThrow(NotFoundException);
    await expect(service.execute('c1')).rejects.toThrow('Template não encontrado');
  });

  it('should throw NotFoundException when condominium missing', async () => {
    contractsRepo.getById.mockResolvedValue({
      contractTemplate: { template: 'x' },
      property: { condominium: null },
      tenant: {},
    });

    const service = makeService();

    await expect(service.execute('c1')).rejects.toThrow(NotFoundException);
    await expect(service.execute('c1')).rejects.toThrow('Condomínio não encontrado');
  });

  it('should throw NotFoundException when tenant missing', async () => {
    contractsRepo.getById.mockResolvedValue({
      contractTemplate: { template: 'x' },
      property: { condominium: { address: {} } },
      tenant: null,
    });

    const service = makeService();

    await expect(service.execute('c1')).rejects.toThrow(NotFoundException);
    await expect(service.execute('c1')).rejects.toThrow('Locatário não encontrado');
  });

  it('should throw NotFoundException when address missing', async () => {
    contractsRepo.getById.mockResolvedValue({
      contractTemplate: { template: 'x' },
      property: { condominium: { address: null } },
      tenant: {},
    });

    const service = makeService();

    await expect(service.execute('c1')).rejects.toThrow(NotFoundException);
    await expect(service.execute('c1')).rejects.toThrow('Endereço não encontrado');
  });

  it('should generate pdf, upload to minio, and return url (using template.template)', async () => {
    contractsRepo.getById.mockResolvedValue({
      contractTemplate: { template: 'TEMPLATE {{condominio.nome}}' },
      property: {
        address: 'Rua do Apto',
        unityNumber: '101',
        unityType: 'APT',
        block: 'B',
        floor: '1',
        totalArea: 10,
        propertySituation: 'OK',
        observations: '',
        condominium: {
          name: 'Condo',
          description: 'Desc',
          address: { street: 'S', number: '10', city: 'C', uf: 'PB' },
        },
      },
      tenant: {
        name: 'T',
        birthDate: '2000-01-01',
        cpf: '1',
        email: 'x',
        maritalStatus: 'S',
        monthlyIncome: 1,
        primaryPhone: '9',
        secondaryPhone: '8',
        professionalInfo: { position: 'Dev' },
        bankingInfo: { bank: 'B', agency: 'A', accountNumber: 'N' },
        additionalResidents: [],
        spouse: { name: 'S', cpf: '2', birthDate: '1999', profession: 'P', monthlyIncome: 1 },
      },
    });

    templateEngine.parse.mockReturnValue('MD');
    pdfGenerator.generate.mockResolvedValue(Buffer.from('PDF'));
    minio.uploadFileBuffer.mockResolvedValue({ fileName: 'contracts/c1_123.pdf' });

    const service = makeService();

    const res = await service.execute('c1');

    expect(templateEngine.parse).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
    );

    expect(pdfGenerator.generate).toHaveBeenCalledWith('MD');

    expect(minio.uploadFileBuffer).toHaveBeenCalledWith(
      expect.any(Buffer),
      expect.stringMatching(/^contracts\/c1_/),
      'application/pdf',
    );

    expect(res).toEqual({ url: 'contracts/c1_123.pdf' });
  });

  it('should use manualContent when provided', async () => {
    contractsRepo.getById.mockResolvedValue({
      contractTemplate: { template: 'IGNORE' },
      property: {
        address: 'Rua do Apto',
        unityNumber: '101',
        unityType: 'APT',
        block: 'B',
        floor: '1',
        totalArea: 10,
        propertySituation: 'OK',
        observations: '',
        condominium: {
          name: 'Condo',
          description: 'Desc',
          address: { street: 'S', number: '10', city: 'C', uf: 'PB' },
        },
      },
      tenant: {
        name: 'T',
        birthDate: '2000-01-01',
        cpf: '1',
        email: 'x',
        maritalStatus: 'S',
        monthlyIncome: 1,
        primaryPhone: '9',
        secondaryPhone: '8',
        professionalInfo: { position: 'Dev' },
        bankingInfo: { bank: 'B', agency: 'A', accountNumber: 'N' },
        additionalResidents: [],
        spouse: { name: 'S', cpf: '2', birthDate: '1999', profession: 'P', monthlyIncome: 1 },
      },
    });

    templateEngine.parse.mockReturnValue('MD2');
    pdfGenerator.generate.mockResolvedValue(Buffer.from('PDF'));
    minio.uploadFileBuffer.mockResolvedValue({ fileName: 'contracts/x.pdf' });

    const service = makeService();

    await service.execute('c1', 'MANUAL {{x}}');

    expect(templateEngine.parse).toHaveBeenCalledWith(
      'MANUAL {{x}}',
      expect.any(Object),
    );
  });
});