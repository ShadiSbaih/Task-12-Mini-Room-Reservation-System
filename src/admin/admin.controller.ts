import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../security/roles.decorator';
import { RolesGuard } from '../security/roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from '../security/dto';
import { RoomResponseDto } from '../rooms/dto';
import { BookingResponseDto } from '../bookings/dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users (Admin only)' })
  @ApiOkResponse({ description: 'List of all users in the system', type: [UserResponseDto] })
  users() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get('rooms')
  @ApiOperation({ summary: 'List all rooms (Admin only)' })
  @ApiOkResponse({ description: 'List of all rooms in the system', type: [RoomResponseDto] })
  rooms() {
    return this.prisma.room.findMany();
  }

  @Get('bookings')
  @ApiOperation({ summary: 'List all bookings (Admin only)' })
  @ApiOkResponse({ description: 'List of all bookings in the system', type: [BookingResponseDto] })
  bookings() {
    return this.prisma.booking.findMany();
  }
}
