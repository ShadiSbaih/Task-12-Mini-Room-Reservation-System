# Room Reservation Backend

A focused NestJS + Prisma backend for managing rooms and bookings with role-based access (Admin, Owner, Guest), accurate availability, and Swagger documentation.

## Tech Stack
- NestJS (`@nestjs/common`, `@nestjs/core`)
- Prisma ORM
- JWT authentication (`@nestjs/jwt`, `passport-jwt`)
- Validation (`class-validator`, `class-transformer`)
- API docs via Swagger

## Quick Start
1. Install dependencies
   - `npm install`
2. Configure environment
   - Edit `.env` if needed:
     - `DATABASE_URL` (defaults to SQLite `file:./prisma/dev.db`)
     - `JWT_SECRET` (set a strong secret)
3. Setup database
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
4. Run the server
   - `npm run start`
5. Open docs
   - Swagger UI at `http://localhost:3000/api`

## Authentication
- Register as `OWNER` or `GUEST`: `POST /auth/register` (email, password, role)
- Login: `POST /auth/login` (returns `accessToken`)
- Use `Authorization: Bearer <token>` for protected endpoints
- Seeded users:
  - Admin: `admin@example.com` / `Admin123!`
  - Owner: `owner@example.com` / `Owner123!`
  - Guest: `guest@example.com` / `Guest123!`

## Endpoints Overview
- Auth
  - `POST /auth/register`
  - `POST /auth/login`
- Rooms (Owner/Admin create/manage; anyone authenticated can list)
  - `POST /rooms` (OWNER, ADMIN) create room
  - `PATCH /rooms/:id` (OWNER, ADMIN) update room
  - `GET /rooms` list rooms with filters and availability window
  - `GET /rooms/:id/bookings` (OWNER, ADMIN) view bookings for a room
- Bookings (Guest/Admin)
  - `POST /bookings` create booking
  - `PATCH /bookings/:id/cancel` cancel own booking
  - `GET /bookings/me` list current user's bookings
- Admin (Admin only)
  - `GET /admin/users`
  - `GET /admin/rooms`
  - `GET /admin/bookings`

## Filters and Availability
- `GET /rooms` supports query params:
  - `priceMin`, `priceMax` (numbers)
  - `capacityMin`, `capacityMax` (numbers)
  - `checkIn`, `checkOut` (ISO date strings)
- Availability logic prevents overlapping bookings and returns only rooms free within `[checkIn, checkOut)`.

## Booking Status
- `PENDING`, `CONFIRMED`, `CANCELLED` stored as strings for SQLite compatibility.

## Notes
- Default DB is SQLite for simplicity; for production use Postgres or MySQL and switch `DATABASE_URL` and Prisma `datasource` accordingly.
- Swagger includes BearerAuth; authorize within Swagger UI to call protected endpoints.

## Project Scripts
- `npm run start` start dev server
- `npm run prisma:generate` generate Prisma client
- `npm run prisma:migrate` apply dev migrations
- `npm run prisma:seed` seed demo users and rooms
