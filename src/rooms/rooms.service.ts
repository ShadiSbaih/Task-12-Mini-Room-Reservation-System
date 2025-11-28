import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomStatus, BookingStatus } from '../common/enums';

interface CreateRoomInput {
  name: string;
  price: number;
  capacity: number;
  status?: RoomStatus;
}

interface UpdateRoomInput {
  name?: string;
  price?: number;
  capacity?: number;
  status?: RoomStatus;
}

interface RoomFilters {
  priceMin?: number;
  priceMax?: number;
  capacityMin?: number;
  capacityMax?: number;
  checkIn?: Date;
  checkOut?: Date;
}

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: number, input: CreateRoomInput) {
    return this.prisma.room.create({ data: { ownerId, name: input.name, price: input.price, capacity: input.capacity, status: input.status ?? RoomStatus.ACTIVE } });
  }

  async update(roomId: number, ownerId: number, input: UpdateRoomInput, requesterRole: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    if (room.ownerId !== ownerId && requesterRole !== 'ADMIN') throw new ForbiddenException('Not allowed');
    return this.prisma.room.update({ where: { id: roomId }, data: input });
  }

  async list(filters: RoomFilters) {
    const where: any = { status: RoomStatus.ACTIVE };
    if (filters.priceMin !== undefined) where.price = { ...(where.price || {}), gte: filters.priceMin };
    if (filters.priceMax !== undefined) where.price = { ...(where.price || {}), lte: filters.priceMax };
    if (filters.capacityMin !== undefined) where.capacity = { ...(where.capacity || {}), gte: filters.capacityMin };
    if (filters.capacityMax !== undefined) where.capacity = { ...(where.capacity || {}), lte: filters.capacityMax };

    if (filters.checkIn && filters.checkOut) {
      where.bookings = {
        none: {
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          AND: [{ checkIn: { lt: filters.checkOut } }, { checkOut: { gt: filters.checkIn } }],
        },
      };
    }

    return this.prisma.room.findMany({ where });
  }

  async bookingsForRoom(roomId: number, ownerId: number, requesterRole: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    if (room.ownerId !== ownerId && requesterRole !== 'ADMIN') throw new ForbiddenException('Not allowed');
    return this.prisma.booking.findMany({ where: { roomId } });
  }
}
