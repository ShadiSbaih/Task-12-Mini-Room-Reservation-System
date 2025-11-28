import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const ownerEmail = 'owner@example.com';
  const guestEmail = 'guest@example.com';

  const adminPwd = await bcrypt.hash('Admin123!', 10);
  const ownerPwd = await bcrypt.hash('Owner123!', 10);
  const guestPwd = await bcrypt.hash('Guest123!', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: adminPwd, role: 'ADMIN' },
  });

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: { email: ownerEmail, passwordHash: ownerPwd, role: 'OWNER' },
  });

  const guest = await prisma.user.upsert({
    where: { email: guestEmail },
    update: {},
    create: { email: guestEmail, passwordHash: guestPwd, role: 'GUEST' },
  });

  const roomA = await prisma.room.upsert({
    where: { id: 1 },
    update: {},
    create: { ownerId: owner.id, name: 'Deluxe Room', price: 120, capacity: 2, status: 'ACTIVE' },
  });

  const roomB = await prisma.room.upsert({
    where: { id: 2 },
    update: {},
    create: { ownerId: owner.id, name: 'Family Suite', price: 200, capacity: 4, status: 'ACTIVE' },
  });

  await prisma.booking.create({
    data: {
      roomId: roomA.id,
      guestId: guest.id,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'CONFIRMED',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
