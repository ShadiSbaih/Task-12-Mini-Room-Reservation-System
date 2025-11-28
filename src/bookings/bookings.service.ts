import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '../common/enums';

interface CreateBookingInput {
  roomId: number;
  checkIn: Date;
  checkOut: Date;
}

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(guestId: number, input: CreateBookingInput) {
    if (input.checkIn >= input.checkOut) throw new BadRequestException('Invalid date range');
    const room = await this.prisma.room.findUnique({ where: { id: input.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const overlap = await this.prisma.booking.findFirst({
      where: {
        roomId: input.roomId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        AND: [{ checkIn: { lt: input.checkOut } }, { checkOut: { gt: input.checkIn } }],
      },
    });
    if (overlap) throw new BadRequestException('Room not available for selected dates');

    return this.prisma.booking.create({ data: { roomId: input.roomId, guestId, checkIn: input.checkIn, checkOut: input.checkOut, status: BookingStatus.CONFIRMED } });
  }

  async cancel(bookingId: number, requesterId: number, requesterRole: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.guestId !== requesterId && requesterRole !== 'ADMIN') throw new ForbiddenException('Not allowed');
    return this.prisma.booking.update({ where: { id: bookingId }, data: { status: BookingStatus.CANCELLED } });
  }

  async listForGuest(guestId: number) {
    return this.prisma.booking.findMany({ where: { guestId } });
  }

  async listAll() {
    return this.prisma.booking.findMany();
  }
}
