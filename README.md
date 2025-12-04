# 🏨 Mini Room Reservation System

A fully functional **NestJS** backend API for managing room reservations with role-based access control. This system enables property owners to manage rooms, guests to make bookings, and administrators to oversee all operations.

## 🎯 Objective

Build a reliable, secure, and well-structured backend that handles the complete lifecycle of rooms and reservations, including:
- Role-based access control (Admin, Owner, Guest)
- Room availability management
- Booking creation and cancellation
- Overlap prevention for bookings
- Comprehensive filtering options
- Complete audit trail with timestamps

---

## 🧩 Core Entities

### **User**
- Represents system users with different roles (ADMIN, OWNER, GUEST)
- Owners create and manage rooms
- Guests browse and book available rooms
- Admins have full system access

### **Room**
- Contains essential details: name, price, capacity, status
- Owned by a specific user (OWNER role)
- Can be ACTIVE or INACTIVE

### **Booking**
- Links a guest to a specific room over a defined date range
- Tracks status: PENDING, CONFIRMED, CANCELLED
- Prevents overlapping reservations

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Mini Room Reservation System"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
The `.env` file is already configured with:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="supersecret_jwt_key_change_me"
```

4. **Generate Prisma Client**
```bash
npm run prisma:generate
```

5. **Run database migrations**
```bash
npm run prisma:migrate
```

6. **Seed the database**
```bash
npm run prisma:seed
```

7. **Start the server**
```bash
npm start
```

The server will be running at `http://localhost:3000`

---

## 📚 Documentation

### Interactive API Documentation (Swagger)
Access the interactive Swagger UI at:
```
http://localhost:3000/api
```

### Detailed API Documentation
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint details, examples, and usage.

### Postman Collection
Import `postman_collection.json` into Postman for ready-to-use API requests.

---

## 🔑 Test Credentials

The database is pre-seeded with test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin123! | ADMIN |
| owner@example.com | Owner123! | OWNER |
| guest@example.com | Guest123! | GUEST |

---

## 🎯 Features & Requirements

### ✅ Owner Capabilities
- ✅ Create new rooms
- ✅ Update existing room details (name, price, capacity, status)
- ✅ View all bookings associated with their rooms

### ✅ Guest Capabilities
- ✅ Browse and view available rooms
- ✅ Filter rooms by price and capacity
- ✅ Check room availability for specific dates
- ✅ Make bookings by selecting check-in and check-out dates
- ✅ Cancel their own bookings

### ✅ Admin Capabilities
- ✅ Full access to all system data
- ✅ View all users, rooms, and bookings
- ✅ Manage any resource in the system

### ✅ System Features
- ✅ **Prisma ORM** for database management
- ✅ **Swagger documentation** for API endpoints
- ✅ **JWT authentication** for secure access
- ✅ **Role-based access control** with guards
- ✅ **Overlapping booking prevention**
- ✅ **Date range availability filtering**
- ✅ **Permission validation** for all operations
- ✅ **Automatic timestamps** (createdAt, updatedAt)
- ✅ **Room filtering** by price and capacity
- ✅ **Booking status tracking** (PENDING, CONFIRMED, CANCELLED)
- ✅ **Admin dashboard endpoints**

---

## 🏗️ Project Structure

```
src/
├── admin/              # Admin dashboard endpoints
├── bookings/           # Booking management
│   ├── dto/           # Data Transfer Objects
│   ├── bookings.controller.ts
│   ├── bookings.service.ts
│   └── bookings.module.ts
├── common/            # Shared enums and utilities
│   └── enums.ts
├── modules/           # App configuration
│   └── app.module.ts
├── prisma/            # Database service
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── rooms/             # Room management
│   ├── dto/          # Data Transfer Objects
│   ├── rooms.controller.ts
│   ├── rooms.service.ts
│   └── rooms.module.ts
├── security/          # Authentication & Authorization
│   ├── dto/          # Auth DTOs
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── roles.decorator.ts
│   └── roles.guard.ts
└── main.ts           # Application entry point

prisma/
├── schema.prisma     # Database schema
├── seed.ts          # Database seeding
└── migrations/      # Database migrations
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the development server |
| `npm run dev` | Start with ts-node |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database with test data |

---

## 🔐 Authentication Flow

1. **Register** a new user via `/auth/register` (OWNER or GUEST role)
2. **Login** via `/auth/login` to receive JWT access token
3. **Include token** in Authorization header: `Bearer <token>`
4. **Access protected endpoints** with appropriate role permissions

---

## 📊 Database Schema

### User Table
- `id` (Primary Key)
- `email` (Unique)
- `passwordHash`
- `role` (ADMIN | OWNER | GUEST)
- `createdAt`, `updatedAt`

### Room Table
- `id` (Primary Key)
- `ownerId` (Foreign Key → User)
- `name`
- `price`
- `capacity`
- `status` (ACTIVE | INACTIVE)
- `createdAt`, `updatedAt`

### Booking Table
- `id` (Primary Key)
- `roomId` (Foreign Key → Room)
- `guestId` (Foreign Key → User)
- `checkIn`
- `checkOut`
- `status` (PENDING | CONFIRMED | CANCELLED)
- `createdAt`, `updatedAt`

---

## 🧪 Testing the API

### Using Swagger UI
1. Navigate to `http://localhost:3000/api`
2. Click "Authorize" button
3. Login to get JWT token
4. Enter token in format: `Bearer <your-token>`
5. Test endpoints directly in browser

### Using Postman
1. Import `postman_collection.json`
2. Use "Login Admin/Owner/Guest" requests to get tokens
3. Tokens are automatically saved to collection variables
4. Test all endpoints with proper authentication

### Example Flow
1. Login as OWNER → Get token
2. Create a room
3. Login as GUEST → Get token
4. View available rooms
5. Create a booking
6. View your bookings
7. Cancel a booking

---

## 🛡️ Security Features

- **Password hashing** with bcrypt
- **JWT tokens** with 7-day expiration
- **Role-based guards** for endpoint protection
- **Input validation** with class-validator
- **SQL injection prevention** via Prisma ORM

---

## 📝 Business Logic

### Room Availability
- Rooms are filtered based on overlapping bookings
- Only shows rooms without CONFIRMED or PENDING bookings during requested dates
- Overlap calculation: `checkIn < existingCheckOut AND checkOut > existingCheckIn`

### Booking Validation
- Check-in must be before check-out
- Cannot book overlapping dates
- Room must exist and be ACTIVE
- Bookings automatically set to CONFIRMED status

### Access Control
- **OWNER**: Manage own rooms, view their room bookings
- **GUEST**: View rooms, create/cancel own bookings
- **ADMIN**: Full system access

---

## 🤝 Contributing

This is a focused room booking management system. Contributions should:
- Maintain clean, readable code
- Follow existing patterns and structure
- Include proper validation and error handling
- Update documentation for new features

---

## 📄 License

This project is created for educational purposes.

---

## 🎓 Tech Stack

- **Framework**: NestJS
- **Database**: SQLite (via Prisma)
- **ORM**: Prisma
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

---

## 📞 Support

For issues, questions, or feature requests, please refer to:
- [API Documentation](./API_DOCUMENTATION.md)
- Swagger UI at `http://localhost:3000/api`
- Postman collection for testing

---

**Built with ❤️ using NestJS and Prisma**