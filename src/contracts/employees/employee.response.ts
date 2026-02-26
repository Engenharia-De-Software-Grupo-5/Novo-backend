import { ContractType, EmployeeStatus, EmployeeRoles } from "@prisma/client";
import { BankDataResponse } from "./bankData.response";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EmployeeResponse {

  @ApiProperty({
    description: 'Employee ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Employee CPF',
    example: '123.456.789-00',
  })
  cpf: string;

  @ApiProperty({
    description: 'Employee name',
    example: 'John Doe',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Employee email',
    example: 'john@email.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Employee phone',
    example: '(11) 91234-5678',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Employee address',
    example: 'Rua dos Bobos, 0',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Employee bank data',
    type: () => BankDataResponse,
    nullable: true,
  })
  bankData?: BankDataResponse | null;

  @ApiProperty({
    description: 'Employee role',
    enum: EmployeeRoles,
    example: EmployeeRoles.GERENTE,
  })
  role: EmployeeRoles;

  @ApiPropertyOptional({
    description: 'Employee contract type',
    enum: ContractType,
    example: ContractType.CLT,
  })
  contractType?: ContractType;

  @ApiPropertyOptional({
    description: 'Employee admission date',
    example: '2023-01-01T00:00:00.000Z',
  })
  admissionDate?: Date;

  @ApiPropertyOptional({
    description: 'Employee base salary',
    example: 5000,
  })
  baseSalary?: number;

  @ApiPropertyOptional({
    description: 'Employee workload',
    example: 40,
  })
  workload?: number;

  @ApiPropertyOptional({
    description: 'Employee status',
    enum: EmployeeStatus,
    example: EmployeeStatus.ATIVO,
  })
  status?: EmployeeStatus;
}