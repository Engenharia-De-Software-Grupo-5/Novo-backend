import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SkipUppercase } from 'src/common/decorators';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Pagination page size',
    example: 10,
    default: 10,
    required: false,
  })
  pageSize?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Pagination page number',
    example: 1,
    default: 1,
    required: false,
  })
  pageNumber?: number = 1;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Garante que sempre será array
  @IsArray()
  @IsString({ each: true })
  @SkipUppercase()
  @ApiProperty({
    description: 'List of columns to filter',
    example: ['name', 'email', 'status'],
    required: false,
    isArray: true,
    type: String,
  })
  columnName?: string[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Garante que sempre será array
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'List of filters typed by user',
    example: ['Vinicius', 'gmail', 'ATIVO'],
    required: false,
    isArray: true,
    type: String,
  })
  content?: string[];
}
