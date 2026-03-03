import { EmployeeRepository } from 'src/repositories/employees/employee.repository';

describe('EmployeeRepository', () => {
  let repo: EmployeeRepository;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      employees: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
        update: jest.fn(),
      },
      bankData: {
        upsert: jest.fn(),
      },
    };

    repo = new EmployeeRepository(prisma);
  });

  it('create should upsert employee by cpf', async () => {
    prisma.employees.upsert.mockResolvedValue({ id: 'e1' });

    const dto = {
      cpf: '12345678900',
      name: 'A',
      birthDate: new Date('2000-01-01'),
      role: 'ROLE' as any,
      status: 'ACTIVE' as any,
    } as any;

    const res = await repo.create('c1', dto);

    expect(prisma.employees.upsert).toHaveBeenCalled();
    expect(res).toEqual({ id: 'e1' });
  });
});