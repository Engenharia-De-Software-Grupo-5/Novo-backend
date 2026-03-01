import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { EmployeePaymentsService } from 'src/services/employees/employee-payments.service';
import { PrismaService } from 'src/common/database/prisma.service';

describe('EmployeePaymentsService', () => {
  let service: EmployeePaymentsService;
  let prisma: any;

  const mockPrisma = {
    employees: { findFirst: jest.fn() },
    employeePayments: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeePaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get(EmployeePaymentsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  const employeeExists = () => prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });

  describe('create', () => {
    it('should throw NotFoundException if employee not found', async () => {
      prisma.employees.findFirst.mockResolvedValue(null);

      await expect(
        service.create('e1', { value: 100, paymentDate: '2024-01-01', type: 'SALARY' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on invalid value', async () => {
      employeeExists();

      await expect(
        service.create('e1', { value: 0, paymentDate: '2024-01-01', type: 'SALARY' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on invalid payment date', async () => {
      employeeExists();

      await expect(
        service.create('e1', { value: 100, paymentDate: 'invalid', type: 'SALARY' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when payment date is in the future', async () => {
      employeeExists();
      const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      await expect(
        service.create('e1', { value: 100, paymentDate: future, type: 'SALARY' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create and return mapped response (YYYY-MM-DD)', async () => {
      employeeExists();

      prisma.employeePayments.create.mockResolvedValue({
        id: 'p1',
        value: 100,
        paymentDate: new Date('2024-01-02T10:00:00Z'),
        type: 'SALARY',
      });

      const res = await service.create('e1', {
        value: 100,
        paymentDate: '2024-01-02',
        type: 'SALARY',
      } as any);

      expect(res).toEqual({
        id: 'p1',
        value: 100,
        paymentDate: '2024-01-02',
        type: 'SALARY',
      });
    });
  });

  describe('list', () => {
    it('should throw NotFoundException if employee not found', async () => {
      prisma.employees.findFirst.mockResolvedValue(null);

      await expect(service.list('e1')).rejects.toThrow(NotFoundException);
    });

    it('should map list to YYYY-MM-DD', async () => {
      employeeExists();

      prisma.employeePayments.findMany.mockResolvedValue([
        { id: 'p1', value: 10, paymentDate: new Date('2024-01-02T00:00:00Z'), type: 'SALARY' },
        { id: 'p2', value: 20, paymentDate: new Date('2024-01-01T00:00:00Z'), type: 'BONUS' },
      ]);

      const res = await service.list('e1');

      expect(res).toEqual([
        { id: 'p1', value: 10, paymentDate: '2024-01-02', type: 'SALARY' },
        { id: 'p2', value: 20, paymentDate: '2024-01-01', type: 'BONUS' },
      ]);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if employee not found', async () => {
      prisma.employees.findFirst.mockResolvedValue(null);

      await expect(service.delete('e1', 'p1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if payment not found', async () => {
      employeeExists();
      prisma.employeePayments.findFirst.mockResolvedValue(null);

      await expect(service.delete('e1', 'p1')).rejects.toThrow(NotFoundException);
      expect(prisma.employeePayments.update).not.toHaveBeenCalled();
    });

    it('should soft delete payment', async () => {
      employeeExists();
      prisma.employeePayments.findFirst.mockResolvedValue({ id: 'p1' });

      await service.delete('e1', 'p1');

      expect(prisma.employeePayments.update).toHaveBeenCalledTimes(1);
      expect(prisma.employeePayments.update.mock.calls[0][0]).toMatchObject({
        where: { id: 'p1' },
      });
    });
  });
});