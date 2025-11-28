import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from '../common/enums';

class CreateRoomDto {
  @ApiProperty({ example: 'Deluxe Room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 120 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ enum: Object.values(RoomStatus) })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}

class UpdateRoomDto {
  @ApiPropertyOptional({ example: 'Updated Room Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ enum: Object.values(RoomStatus) })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}

class RoomFiltersDto {
  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceMin?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceMax?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacityMin?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacityMax?: number;

  @ApiPropertyOptional({ example: '2025-12-01T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  checkIn?: Date;

  @ApiPropertyOptional({ example: '2025-12-03T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  checkOut?: Date;
}

@ApiTags('rooms')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private rooms: RoomsService) {}

  @Roles('OWNER', 'ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a room (OWNER or ADMIN)' })
  @ApiCreatedResponse({ description: 'Room created' })
  create(@Body() dto: CreateRoomDto, @Request() req: any) {
    return this.rooms.create(req.user.userId, dto);
  }

  @Roles('OWNER', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update room fields (OWNER or ADMIN)' })
  @ApiOkResponse({ description: 'Room updated' })
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto, @Request() req: any) {
    return this.rooms.update(Number(id), req.user.userId, dto, req.user.role);
  }

  @Get()
  @ApiOperation({ summary: 'List rooms with filtering and availability' })
  @ApiOkResponse({ description: 'List of rooms' })
  @ApiQuery({ name: 'priceMin', required: false })
  @ApiQuery({ name: 'priceMax', required: false })
  @ApiQuery({ name: 'capacityMin', required: false })
  @ApiQuery({ name: 'capacityMax', required: false })
  @ApiQuery({ name: 'checkIn', required: false, description: 'ISO date string' })
  @ApiQuery({ name: 'checkOut', required: false, description: 'ISO date string' })
  list(@Query() q: RoomFiltersDto) {
    return this.rooms.list(q);
  }

  @Roles('OWNER', 'ADMIN')
  @Get(':id/bookings')
  @ApiOperation({ summary: 'View bookings for a specific room (OWNER/ADMIN)' })
  @ApiOkResponse({ description: 'Room bookings' })
  bookings(@Param('id') id: string, @Request() req: any) {
    return this.rooms.bookingsForRoom(Number(id), req.user.userId, req.user.role);
  }
}
