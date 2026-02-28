import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested} from 'class-validator';
import { EmployeeStatus, ContractType, EmployeeRoles } from '@prisma/client';
import { BankDataDto } from './bankData.dto';
import { IsCPF } from 'class-validator-cpf';
import { EmployeeContractDto } from './employeeContract.dto';


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

    
    @IsString()
    @IsNotEmpty()
    @IsISO8601()
    @ApiProperty({
        description: "Obrigatory field for employee's birth date",
        example: '1990-01-01',
    })
    birthDate: string;

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
    @IsString()
    @IsISO8601()
    @ApiPropertyOptional({
        description: "Optional field for employee's admission date",
        example: '2013-01-27',
    })
    admissionDate?: string;

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
        description: "Optional field for employee's current state (ACTIVE is the dafault option)",
        enum: EmployeeStatus,
        example: EmployeeStatus.ACTIVE,
    })
    status: EmployeeStatus;

    @IsOptional()
    @ValidateNested()
    @Type(() => EmployeeContractDto)
    @ApiPropertyOptional({
        description: 'Optional field for employee last contract',
        type: () => EmployeeContractDto,
    })
    lastContract?: EmployeeContractDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EmployeeContractDto)
    @ApiPropertyOptional({ type: () => [EmployeeContractDto] })
    contracts?: EmployeeContractDto[];

}
