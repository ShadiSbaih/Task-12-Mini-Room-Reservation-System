import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../security/roles.decorator';
import { RolesGuard } from '../security/roles.guard';
import { BookingsService } from './bookings.service';
import { Type } from 'class-transformer';
import { IsDate, IsInt } from 'class-validator';

class CreateBookingDto {
  @Type(() => Number)
  @IsInt()
  roomId: number;

  @Type(() => Date)
  @IsDate()
  checkIn: Date;

  @Type(() => Date)
  @IsDate()
  checkOut: Date;
}

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookings: BookingsService) {}

  @Roles('GUEST', 'ADMIN')
  @Post()
  create(@Body() dto: CreateBookingDto, @Request() req: any) {
    return this.bookings.create(req.user.userId, dto);
  }

  @Roles('GUEST', 'ADMIN')
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.bookings.cancel(Number(id), req.user.userId, req.user.role);
  }

  @Roles('GUEST')
  @Get('me')
  myBookings(@Request() req: any) {
    return this.bookings.listForGuest(req.user.userId);
  }
}
