import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested} from 'class-validator';
import { EmployeeStatus, ContractType, EmployeeRoles } from '@prisma/client';
import { BankDataDto } from './bankData.dto';
import { IsCPF } from 'class-validator-cpf';


export class EmployeeDto {
    @IsCPF()
    @ApiProperty({
        description: "Obrigatory field for employee's cpf (just numbers)",
        example: '17508074084',
    })
    cpf: string; 
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Obrigatory field for employee's name",
        example: 'Oswaldo Fernades',
    })
    name: string;

    
    @Type(() => Date)
    @IsDate()
    @ApiProperty({
        description: "Obrigatory field for employee's birth date",
        example: '1990-01-01T00:00:00.000Z',
    })
    birthDate: Date;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "Optional field for employee's email",
        example: 'oswaldo@email.com',
    })
    email?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "Optional field for employee's phone number",
        example: '(11) 91234-5678',
    })
    phone?: string;
    
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "Optional field for employee's address",
        example: 'Rua dos Bobos, 0',
    })
    address?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => BankDataDto)
    @ApiPropertyOptional({
        description: 'All of the bank data content',
        type: () => BankDataDto,
    })
    bankData?: BankDataDto;
    
    @IsEnum(EmployeeRoles)
    @ApiProperty({
        description: "Obrigatory field for employee's role",
        enum: EmployeeRoles,
        example: EmployeeRoles.GERENTE,
    })
    role: EmployeeRoles;
    
    @IsOptional()
    @IsEnum(ContractType)
    @ApiPropertyOptional({
        description: 'Optional field for employee contract type',
        enum: ContractType,
        example: ContractType.CLT,
    })
    contractType?: ContractType;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @ApiPropertyOptional({
        description: "Optional field for employee's admission date",
        example: '2013-01-27T04:59:32.000Z',
    })
    admissionDate?: Date;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @ApiPropertyOptional({
        description: "Optional field for employee's base salary",
        example: 1621,
    })
    baseSalary?: number; 
        
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @ApiPropertyOptional({
        description: "Optional field for employee's workload in hours",
        example: 10,
    })
    workload?: number;      

    @IsOptional()
    @IsEnum(EmployeeStatus)
    @ApiPropertyOptional({
        description: "Optional field for employee's current state (ATIVO is the dafault option)",
        enum: EmployeeStatus,
        example: EmployeeStatus.ATIVO,
    })
    status?: EmployeeStatus;

    lastContract?: EmployeeContract;

    contracts?: {
        id: string;
        name: string;
        type: string;
        size: number;
        url: string;
    }[];

}

export interface EmployeeContract {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}
