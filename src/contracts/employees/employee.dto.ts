import { ApiProperty} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
import { EmployeeStatus, ContractType } from '@prisma/client';
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
        description: "Obrigatory field for employee's role",
        example: 'doorman',
    })
    role: string;
    
    @IsEnum(ContractType)
    @ApiProperty({
        description: 'Obtigatory field for employee contract type',
        enum: ContractType,
        example: ContractType.CLT,
    })
    contractType: ContractType;

    @Type(() => Date)
    @IsDate()
    @ApiProperty({
        description: "Obrigatory field for employee's hiring date",
        example: '2013-01-27T04:59:32.000Z',
    })
    hireDate: Date;

    @Type(() => Number)
    @IsNumber()
    @ApiProperty({
        description: "Obrigatory field for employee's base salary",
        example: 1621,
    })
    baseSalary: number; 
        
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({
        description: "Obrigatory field for employee's workload in hours",
        example: 10,
    })
    workload: number;      

    @IsOptional()
    @IsEnum(EmployeeStatus)
    @ApiProperty({
        description: "Optional field for employee's current state (ACTIVE is the dafault option)",
        enum: EmployeeStatus,
        example: EmployeeStatus.ACTIVE,
    })
    status?: EmployeeStatus;

}