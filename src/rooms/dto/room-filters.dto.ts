import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RoomFiltersDto {
  @ApiPropertyOptional({ example: 100, description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceMin?: number;

  @ApiPropertyOptional({ example: 200, description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceMax?: number;

  @ApiPropertyOptional({ example: 2, description: 'Minimum capacity filter' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacityMin?: number;

  @ApiPropertyOptional({ example: 4, description: 'Maximum capacity filter' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacityMax?: number;

  @ApiPropertyOptional({ example: '2025-12-01T00:00:00.000Z', description: 'Check-in date for availability' })
  @IsOptional()
  @Type(() => Date)
  checkIn?: Date;

  @ApiPropertyOptional({ example: '2025-12-03T00:00:00.000Z', description: 'Check-out date for availability' })
  @IsOptional()
  @Type(() => Date)
  checkOut?: Date;
}
