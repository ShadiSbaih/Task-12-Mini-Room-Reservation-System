import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../security/roles.decorator';
import { RolesGuard } from '../security/roles.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, BookingResponseDto } from './dto';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookings: BookingsService) {}

  @Roles('GUEST', 'ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a booking for a room (Guest/Admin)' })
  @ApiCreatedResponse({ description: 'Booking created successfully', type: BookingResponseDto })
  create(@Body() dto: CreateBookingDto, @Request() req: any) {
    return this.bookings.create(req.user.userId, dto);
  }

  @Roles('GUEST', 'ADMIN')
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel own booking (Guest/Admin)' })
  @ApiOkResponse({ description: 'Booking cancelled successfully', type: BookingResponseDto })
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.bookings.cancel(Number(id), req.user.userId, req.user.role);
  }

  @Roles('GUEST')
  @Get('me')
  @ApiOperation({ summary: 'List my bookings (Guest)' })
  @ApiOkResponse({ description: 'List of user bookings', type: [BookingResponseDto] })
  myBookings(@Request() req: any) {
    return this.bookings.listForGuest(req.user.userId);
  }
}
