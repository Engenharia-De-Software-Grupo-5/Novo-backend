import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentType } from '@prisma/client';


import { PrismaService } from 'src/common/database/prisma.service';
import { EmployeePaymentsService } from 'src/services/employees/employee-payments.service';

describe('EmployeePaymentsService', () => {
  let service: EmployeePaymentsService;

  // IMPORTANT: tipa como "any" (ou Partial<PrismaService>) para permitir jest.fn()
  let prisma: {
    employees: { findFirst: jest.Mock };
    employeePayments: { create: jest.Mock; findMany: jest.Mock };
  };

  const makePrismaMock = () => ({
    employees: {
      findFirst: jest.fn(),
    },
    employeePayments: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  });

  beforeEach(async () => {
    prisma = makePrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeePaymentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(EmployeePaymentsService);
  });

  it('should create payment (happy path)', async () => {
    const employeeId = 'emp-1';
    const dto = {
      value: 2500,
      paymentDate: '2026-02-18',
      type: PaymentType.SALARY,
    };

    prisma.employees.findFirst.mockResolvedValue({ id: employeeId });
    prisma.employeePayments.create.mockResolvedValue({
      id: 'pay-1',
      value: 2500,
      paymentDate: new Date('2026-02-18T00:00:00.000Z'),
      type: PaymentType.SALARY,
    });

    const result = await service.create(employeeId, dto as any);

    expect(prisma.employees.findFirst).toHaveBeenCalled();
    expect(prisma.employeePayments.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          employeeId,
          value: 2500,
          type: PaymentType.SALARY,
        }),
      }),
    );

    expect(result).toEqual({
      id: 'pay-1',
      value: 2500,
      paymentDate: '2026-02-18',
      type: PaymentType.SALARY,
    });
  });

  it('should throw NotFoundException when employee not found', async () => {
    prisma.employees.findFirst.mockResolvedValue(null);

    await expect(
      service.create('emp-x', {
        value: 10,
        paymentDate: '2026-02-18',
        type: PaymentType.OTHER,
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.employeePayments.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when value invalid', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });

    await expect(
      service.create('emp-1', {
        value: 0,
        paymentDate: '2026-02-18',
        type: PaymentType.OTHER,
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.employeePayments.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when date invalid', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });

    await expect(
      service.create('emp-1', {
        value: 100,
        paymentDate: 'not-a-date',
        type: PaymentType.OTHER,
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.employeePayments.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when date is future', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'emp-1' });

    const future = new Date();
    future.setDate(future.getDate() + 3);
    const futureIso = future.toISOString().slice(0, 10);

    await expect(
      service.create('emp-1', {
        value: 100,
        paymentDate: futureIso,
        type: PaymentType.OTHER,
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.employeePayments.create).not.toHaveBeenCalled();
  });

  it('should list payments (happy path)', async () => {
    const employeeId = 'emp-1';
    prisma.employees.findFirst.mockResolvedValue({ id: employeeId });

    prisma.employeePayments.findMany.mockResolvedValue([
      {
        id: 'pay-1',
        value: 100,
        paymentDate: new Date('2026-02-10T00:00:00.000Z'),
        type: PaymentType.BONUS,
      },
      {
        id: 'pay-2',
        value: 200,
        paymentDate: new Date('2026-02-05T00:00:00.000Z'),
        type: PaymentType.SALARY,
      },
    ]);

    const result = await service.list(employeeId);

    expect(prisma.employeePayments.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ employeeId, deletedAt: null }),
        orderBy: { paymentDate: 'desc' },
      }),
    );

    expect(result).toEqual([
      { id: 'pay-1', value: 100, paymentDate: '2026-02-10', type: PaymentType.BONUS },
      { id: 'pay-2', value: 200, paymentDate: '2026-02-05', type: PaymentType.SALARY },
    ]);
  });

  it('should throw NotFoundException on list when employee not found', async () => {
    prisma.employees.findFirst.mockResolvedValue(null);

    await expect(service.list('emp-x')).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.employeePayments.findMany).not.toHaveBeenCalled();
  });
});