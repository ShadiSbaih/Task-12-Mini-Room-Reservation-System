import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../security/roles.decorator';
import { RolesGuard } from '../security/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ description: 'List of users' })
  users() {
    return this.prisma.user.findMany();
  }

  @Get('rooms')
  @ApiOperation({ summary: 'List all rooms' })
  @ApiOkResponse({ description: 'List of rooms' })
  rooms() {
    return this.prisma.room.findMany();
  }

  @Get('bookings')
  @ApiOperation({ summary: 'List all bookings' })
  @ApiOkResponse({ description: 'List of bookings' })
  bookings() {
    return this.prisma.booking.findMany();
  }
}
