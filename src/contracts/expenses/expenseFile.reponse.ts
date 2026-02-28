import { ApiProperty } from "@nestjs/swagger";
import { ExpenseTargetType } from "@prisma/client";
import { IsOptional, isString } from "class-validator";

export class expenseFileReponse {
    @ApiProperty({ description: 'Expense file id ' })
    id: string;
    
    @ApiProperty({ description: 'orginal link'})
    link: string;
    
    @ApiProperty({ description: 'expense file type' })
    @IsOptional()
    type?: string;
}