import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from '../../common/enums';

export class UpdateRoomDto {
  @ApiPropertyOptional({ example: 'Updated Room Name', description: 'Name of the room' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 150, description: 'Price per night' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 3, description: 'Maximum capacity' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ enum: RoomStatus, description: 'Room status' })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}
