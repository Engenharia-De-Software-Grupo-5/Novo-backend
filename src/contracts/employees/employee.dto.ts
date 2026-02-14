import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested} from 'class-validator';
import { EmployeeStatus, ContractType } from '@prisma/client';
import { BankDataDto } from './bankData.dto';
import { IsCPF } from 'class-validator-cpf';


export class EmployeeDto {
    @IsCPF()
    @IsNotEmpty()
    @ApiProperty({
        description: "Employee's cpf (just numbers)",
        example: '12312312312',
    })
    cpf: string; 
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Employee's name",
        example: 'Oswaldo Fernades',
    })
    name: string;

    @ValidateNested()
    @Type(() => BankDataDto)
    @ApiProperty({
        description: 'All of the bank data content',
        type: () => BankDataDto,
    })
    bankData: BankDataDto;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Employee's role",
        example: 'doorman',
    })
    role: string;
    
    @IsEnum(ContractType)
    @ApiProperty({
        description: 'Employee contract type',
        enum: ContractType,
        example: ContractType.CLT,
    })
    contractType: ContractType;

    @Type(() => Date)
    @IsDate()
    @ApiProperty({
        description: "Employee's hiring date",
        example: '2025-02-03T00:00:00.000Z',
    })
    hireDate: Date;

    @Type(() => Number)
    @IsNumber()
    @ApiProperty({
        description: "Employee's base salary",
        example: 10,
    })
    baseSalary: number; 
        
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({
        description: "Employee's workload",
        example: 10,
    })
    workload: number;      

    @IsOptional()
    @IsEnum(EmployeeStatus)
    @ApiProperty({
        description: "Employee's current state",
        enum: EmployeeStatus,
        example: EmployeeStatus.ACTIVE,
    })
    status?: EmployeeStatus;

}