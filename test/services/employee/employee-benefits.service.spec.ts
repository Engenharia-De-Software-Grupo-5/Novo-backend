import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { EmployeeBenefitsService } from 'src/services/employees/employee-benefits.service';
import { PrismaService } from 'src/common/database/prisma.service';

describe('EmployeeBenefitsService', () => {
  let service: EmployeeBenefitsService;
  let prisma: any;

  const mockPrisma = {
    employees: { findFirst: jest.fn() },
    employeeBenefits: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeBenefitsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get(EmployeeBenefitsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw NotFoundException when employee not found', async () => {
      prisma.employees.findFirst.mockResolvedValue(null);

      await expect(
        service.create('e1', { type: 'X', referenceYear: 2024, value: 100 } as any),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.employeeBenefits.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on invalid value (<=0)', async () => {
      prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });

      await expect(
        service.create('e1', { type: 'X', referenceYear: 2024, value: 0 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create benefit', async () => {
      prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.employeeBenefits.create.mockResolvedValue({ id: 'b1' });

      const res = await service.create('e1', {
        type: 'X',
        referenceYear: 2024,
        value: 100,
      } as any);

      expect(prisma.employeeBenefits.create).toHaveBeenCalledWith({
        data: { employeeId: 'e1', type: 'X', referenceYear: 2024, value: 100 },
      });
      expect(res).toEqual({ id: 'b1' });
    });
  });

  describe('list', () => {
    it('should throw NotFoundException when employee not found', async () => {
      prisma.employees.findFirst.mockResolvedValue(null);

      await expect(service.list('e1')).rejects.toThrow(NotFoundException);
    });

    it('should list benefits ordered', async () => {
      prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.employeeBenefits.findMany.mockResolvedValue([{ id: 'b1' }]);

      const res = await service.list('e1');

      expect(prisma.employeeBenefits.findMany).toHaveBeenCalledWith({
        where: { employeeId: 'e1', deletedAt: null },
        orderBy: { referenceYear: 'desc' },
      });
      expect(res).toEqual([{ id: 'b1' }]);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when employee not found', async () => {
      prisma.employees.findFirst.mockResolvedValue(null);

      await expect(
        service.update('b1', 'e1', { type: 'X', referenceYear: 2024, value: 10 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when record not found', async () => {
      prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.employeeBenefits.findFirst.mockResolvedValue(null);

      await expect(
        service.update('b1', 'e1', { type: 'X', referenceYear: 2024, value: 10 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on invalid value', async () => {
      prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.employeeBenefits.findFirst.mockResolvedValue({ id: 'b1' });

      await expect(
        service.update('b1', 'e1', { type: 'X', referenceYear: 2024, value: -1 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update benefit', async () => {
      prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.employeeBenefits.findFirst.mockResolvedValue({ id: 'b1' });
      prisma.employeeBenefits.update.mockResolvedValue({ id: 'b1', value: 200 });

      const res = await service.update('b1', 'e1', {
        type: 'Y',
        referenceYear: 2025,
        value: 200,
      } as any);

      expect(prisma.employeeBenefits.update).toHaveBeenCalledWith({
        where: { id: 'b1' },
        data: { type: 'Y', referenceYear: 2025, value: 200 },
      });

      expect(res).toEqual({ id: 'b1', value: 200 });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when employee not found', async () => {
      prisma.employees.findFirst.mockResolvedValue(null);

      await expect(service.remove('b1', 'e1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when record not found', async () => {
      prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.employeeBenefits.findFirst.mockResolvedValue(null);

      await expect(service.remove('b1', 'e1')).rejects.toThrow(NotFoundException);
    });

    it('should soft delete benefit and return message', async () => {
      prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.employeeBenefits.findFirst.mockResolvedValue({ id: 'b1' });
      prisma.employeeBenefits.update.mockResolvedValue({ id: 'b1' });

      const res = await service.remove('b1', 'e1');

      expect(prisma.employeeBenefits.update).toHaveBeenCalledTimes(1);
      expect(res).toEqual({ message: 'Record removed successfully.' });
    });
  });
});