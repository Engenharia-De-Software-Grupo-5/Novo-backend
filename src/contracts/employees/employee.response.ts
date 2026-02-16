import { ContractType, EmployeeStatus } from "@prisma/client";
import { BankDataResponse } from "./bankData.response";
import { ApiProperty } from "@nestjs/swagger";

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
        @ApiProperty({
    description: 'Employee bank data',
    type: BankDataResponse,
  })
    bankData: BankDataResponse;
        @ApiProperty({
    description: 'Employee role',
    example: 'Manager',
  })
    role: string;
        @ApiProperty({
    description: 'Employee contract type',
    example: ContractType.CLT,
  })
    contractType: ContractType;
        @ApiProperty({
    description: 'Employee hire date',
    example: '2023-01-01',
  })
    hireDate: Date;
            @ApiProperty({
    description: 'Employee base salary',
    example: 5000,
  })
    baseSalary: number; 
        @ApiProperty({
    description: 'Employee workload',
    example: 40,
  })
    workload: number;
    @ApiProperty({
    description: 'Employee status',
    example: EmployeeStatus.ACTIVE,
  })
    status?: EmployeeStatus;
}
