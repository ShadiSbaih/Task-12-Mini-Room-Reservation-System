import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  roomId: number;

  @ApiProperty({ example: 3 })
  guestId: number;

  @ApiProperty({ example: '2025-12-10T00:00:00.000Z' })
  checkIn: Date;

  @ApiProperty({ example: '2025-12-12T00:00:00.000Z' })
  checkOut: Date;

  @ApiProperty({ example: 'CONFIRMED', enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] })
  status: string;

  @ApiProperty({ example: '2025-12-04T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-04T10:00:00.000Z' })
  updatedAt: Date;
}
