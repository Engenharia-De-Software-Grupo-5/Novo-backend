import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BenefitType } from '@prisma/client';

import { EmployeeBenefitsService } from 'src/services/employees/employee-benefits.service';
import { PrismaService } from 'src/common/database/prisma.service';

describe('EmployeeBenefitsService', () => {
  let service: EmployeeBenefitsService;

  let prisma: {
    employees: { findFirst: jest.Mock };
    employeeBenefits: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
  };

  const makePrismaMock = () => ({
    employees: { findFirst: jest.fn() },
    employeeBenefits: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  });

  beforeEach(async () => {
    prisma = makePrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeBenefitsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(EmployeeBenefitsService);
  });

  it('should create benefit (happy path)', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });

    prisma.employeeBenefits.create.mockResolvedValue({
      id: 'ben-1',
      employeeId: 'emp-1',
      type: BenefitType.VACATION,
      referenceYear: 2026,
      value: 2500,
    });

    const dto = { type: BenefitType.VACATION, referenceYear: 2026, value: 2500 };
    const result = await service.create('emp-1', dto as any);

    expect(prisma.employeeBenefits.create).toHaveBeenCalled();
    expect(result.id).toBe('ben-1');
  });

  it('should throw NotFoundException on create when employee not found', async () => {
    prisma.employees.findFirst.mockResolvedValue(null);

    await expect(
      service.create('emp-x', { type: BenefitType.VACATION, referenceYear: 2026, value: 100 } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw BadRequestException on create when value invalid', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });

    await expect(
      service.create('emp-1', { type: BenefitType.VACATION, referenceYear: 2026, value: 0 } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should list benefits (happy path)', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });

    prisma.employeeBenefits.findMany.mockResolvedValue([{ id: 'ben-1' }, { id: 'ben-2' }]);

    const result = await service.list('emp-1');

    expect(prisma.employeeBenefits.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it('should update benefit when employee matches', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });
    prisma.employeeBenefits.findFirst.mockResolvedValue({ id: 'ben-1' });

    prisma.employeeBenefits.update.mockResolvedValue({
      id: 'ben-1',
      employeeId: 'emp-1',
      type: BenefitType.THIRTEENTH,
      referenceYear: 2026,
      value: 3000,
    });

    const dto = { type: BenefitType.THIRTEENTH, referenceYear: 2026, value: 3000 };
    const result = await service.update('emp-1', 'ben-1', dto as any);

    expect(prisma.employeeBenefits.update).toHaveBeenCalled();
    expect(result.id).toBe('ben-1');
  });

  it('should throw NotFoundException if benefit does not belong to employee', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });
    prisma.employeeBenefits.findFirst.mockResolvedValue(null);

    await expect(
      service.update('emp-1', 'ben-1', {
        type: BenefitType.VACATION,
        referenceYear: 2026,
        value: 2000,
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should remove benefit when employee matches', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });
    prisma.employeeBenefits.findFirst.mockResolvedValue({ id: 'ben-1' });
    prisma.employeeBenefits.update.mockResolvedValue({ id: 'ben-1' });

    const result = await service.remove('emp-1', 'ben-1');

    expect(prisma.employeeBenefits.update).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Record removed successfully.' });
  });

  it('should throw NotFoundException when removing non-owned benefit', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });
    prisma.employeeBenefits.findFirst.mockResolvedValue(null);

    await expect(service.remove('emp-1', 'ben-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});