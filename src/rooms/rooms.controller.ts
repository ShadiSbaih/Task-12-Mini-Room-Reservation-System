import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoomDto, UpdateRoomDto, RoomFiltersDto, RoomResponseDto } from './dto';
import { BookingResponseDto } from '../bookings/dto';

@ApiTags('rooms')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private rooms: RoomsService) {}

  @Roles('OWNER', 'ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a room (OWNER or ADMIN)' })
  @ApiCreatedResponse({ description: 'Room created successfully', type: RoomResponseDto })
  create(@Body() dto: CreateRoomDto, @Request() req: any) {
    return this.rooms.create(req.user.userId, dto);
  }

  @Roles('OWNER', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update room fields (OWNER or ADMIN)' })
  @ApiOkResponse({ description: 'Room updated successfully', type: RoomResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto, @Request() req: any) {
    return this.rooms.update(Number(id), req.user.userId, dto, req.user.role);
  }

  @Get()
  @ApiOperation({ summary: 'List rooms with filtering and availability' })
  @ApiOkResponse({ description: 'List of rooms matching filters', type: [RoomResponseDto] })
  @ApiQuery({ name: 'priceMin', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'priceMax', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'capacityMin', required: false, description: 'Minimum capacity filter' })
  @ApiQuery({ name: 'capacityMax', required: false, description: 'Maximum capacity filter' })
  @ApiQuery({ name: 'checkIn', required: false, description: 'Check-in date (ISO format)' })
  @ApiQuery({ name: 'checkOut', required: false, description: 'Check-out date (ISO format)' })
  list(@Query() q: RoomFiltersDto) {
    return this.rooms.list(q);
  }

  @Roles('OWNER', 'ADMIN')
  @Get(':id/bookings')
  @ApiOperation({ summary: 'View bookings for a specific room (OWNER/ADMIN)' })
  @ApiOkResponse({ description: 'List of bookings for the room', type: [BookingResponseDto] })
  bookings(@Param('id') id: string, @Request() req: any) {
    return this.rooms.bookingsForRoom(Number(id), req.user.userId, req.user.role);
  }
}
