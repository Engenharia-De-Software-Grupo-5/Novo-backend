import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class ExpenseFileResponse {
    @ApiProperty({ description: 'Expense file id ' })
    id: string;
  
    @ApiProperty({ description: 'Expense file id ' })
    name: string;
  
    @ApiProperty({ description: 'orginal link'})
    link: string;
    
    @ApiProperty({ description: 'expense file type' })
    @IsOptional()
    type?: string;
}