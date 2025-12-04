import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'ID of the room to book' })
  @Type(() => Number)
  @IsInt()
  roomId: number;

  @ApiProperty({ example: '2025-12-01T00:00:00.000Z', description: 'Check-in date' })
  @Type(() => Date)
  @IsDate()
  checkIn: Date;

  @ApiProperty({ example: '2025-12-03T00:00:00.000Z', description: 'Check-out date' })
  @Type(() => Date)
  @IsDate()
  checkOut: Date;
}
