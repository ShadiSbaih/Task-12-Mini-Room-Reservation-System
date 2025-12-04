import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from '../../common/enums';

export class CreateRoomDto {
  @ApiProperty({ example: 'Deluxe Room', description: 'Name of the room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 120, description: 'Price per night' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ example: 2, description: 'Maximum capacity' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ enum: RoomStatus, description: 'Room status' })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}
