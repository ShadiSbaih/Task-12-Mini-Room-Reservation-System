import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from '../common/enums';

class CreateRoomDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}

class UpdateRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}

class RoomFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacityMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacityMax?: number;

  @IsOptional()
  @Type(() => Date)
  checkIn?: Date;

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
  create(@Body() dto: CreateRoomDto, @Request() req: any) {
    return this.rooms.create(req.user.userId, dto);
  }

  @Roles('OWNER', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto, @Request() req: any) {
    return this.rooms.update(Number(id), req.user.userId, dto, req.user.role);
  }

  @Get()
  list(@Query() q: RoomFiltersDto) {
    return this.rooms.list(q);
  }

  @Roles('OWNER', 'ADMIN')
  @Get(':id/bookings')
  bookings(@Param('id') id: string, @Request() req: any) {
    return this.rooms.bookingsForRoom(Number(id), req.user.userId, req.user.role);
  }
}
