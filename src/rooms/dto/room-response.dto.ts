import { ApiProperty } from '@nestjs/swagger';

export class RoomResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  ownerId: number;

  @ApiProperty({ example: 'Deluxe Room' })
  name: string;

  @ApiProperty({ example: 120 })
  price: number;

  @ApiProperty({ example: 2 })
  capacity: number;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  status: string;

  @ApiProperty({ example: '2025-12-04T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-04T10:00:00.000Z' })
  updatedAt: Date;
}
