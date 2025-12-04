# API Documentation - Room Reservation System

This document provides detailed information about all available API endpoints, request/response formats, and usage examples.

## Base URL
```
http://localhost:3000
```

## Swagger Documentation
Interactive API documentation is available at:
```
http://localhost:3000/api
```

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 1. Authentication

#### Register a New User
**POST** `/auth/register`

Register as OWNER or GUEST. ADMIN users cannot be created through registration.

**Request Body:**
```json
{
  "email": "owner@example.com",
  "password": "Owner123!",
  "role": "OWNER"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "owner@example.com",
  "role": "OWNER"
}
```

**Status Codes:**
- `201` - User successfully registered
- `400` - Email already exists or invalid role

---

#### Login
**POST** `/auth/login`

Authenticate and receive JWT access token.

**Request Body:**
```json
{
  "email": "owner@example.com",
  "password": "Owner123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200` - Successfully authenticated
- `401` - Invalid credentials

---

### 2. Rooms

#### Create a Room
**POST** `/rooms`

**Auth Required:** OWNER or ADMIN

**Request Body:**
```json
{
  "name": "Deluxe Room",
  "price": 120,
  "capacity": 2,
  "status": "ACTIVE"
}
```

**Response:**
```json
{
  "id": 1,
  "ownerId": 2,
  "name": "Deluxe Room",
  "price": 120,
  "capacity": 2,
  "status": "ACTIVE",
  "createdAt": "2025-12-04T10:00:00.000Z",
  "updatedAt": "2025-12-04T10:00:00.000Z"
}
```

**Status Codes:**
- `201` - Room created successfully
- `401` - Unauthorized
- `403` - Forbidden (wrong role)

---

#### Update a Room
**PATCH** `/rooms/:id`

**Auth Required:** OWNER (must own the room) or ADMIN

**Request Body:**
```json
{
  "name": "Updated Room Name",
  "price": 150,
  "capacity": 3,
  "status": "ACTIVE"
}
```

**Response:**
```json
{
  "id": 1,
  "ownerId": 2,
  "name": "Updated Room Name",
  "price": 150,
  "capacity": 3,
  "status": "ACTIVE",
  "createdAt": "2025-12-04T10:00:00.000Z",
  "updatedAt": "2025-12-04T11:00:00.000Z"
}
```

**Status Codes:**
- `200` - Room updated successfully
- `403` - Not authorized to update this room
- `404` - Room not found

---

#### List Rooms with Filters
**GET** `/rooms`

**Auth Required:** Yes (any authenticated user)

**Query Parameters:**
- `priceMin` (optional): Minimum price
- `priceMax` (optional): Maximum price
- `capacityMin` (optional): Minimum capacity
- `capacityMax` (optional): Maximum capacity
- `checkIn` (optional): Check-in date (ISO format)
- `checkOut` (optional): Check-out date (ISO format)

**Example Request:**
```
GET /rooms?priceMin=100&priceMax=200&capacityMin=2&checkIn=2025-12-10T00:00:00.000Z&checkOut=2025-12-12T00:00:00.000Z
```

**Response:**
```json
[
  {
    "id": 1,
    "ownerId": 2,
    "name": "Deluxe Room",
    "price": 120,
    "capacity": 2,
    "status": "ACTIVE",
    "createdAt": "2025-12-04T10:00:00.000Z",
    "updatedAt": "2025-12-04T10:00:00.000Z"
  },
  {
    "id": 2,
    "ownerId": 2,
    "name": "Family Suite",
    "price": 200,
    "capacity": 4,
    "status": "ACTIVE",
    "createdAt": "2025-12-04T10:00:00.000Z",
    "updatedAt": "2025-12-04T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Successfully retrieved rooms

---

#### View Room Bookings
**GET** `/rooms/:id/bookings`

**Auth Required:** OWNER (must own the room) or ADMIN

**Response:**
```json
[
  {
    "id": 1,
    "roomId": 1,
    "guestId": 3,
    "checkIn": "2025-12-05T00:00:00.000Z",
    "checkOut": "2025-12-07T00:00:00.000Z",
    "status": "CONFIRMED",
    "createdAt": "2025-12-04T10:00:00.000Z",
    "updatedAt": "2025-12-04T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Successfully retrieved bookings
- `403` - Not authorized to view bookings for this room
- `404` - Room not found

---

### 3. Bookings

#### Create a Booking
**POST** `/bookings`

**Auth Required:** GUEST or ADMIN

**Request Body:**
```json
{
  "roomId": 1,
  "checkIn": "2025-12-10T00:00:00.000Z",
  "checkOut": "2025-12-12T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": 1,
  "roomId": 1,
  "guestId": 3,
  "checkIn": "2025-12-10T00:00:00.000Z",
  "checkOut": "2025-12-12T00:00:00.000Z",
  "status": "CONFIRMED",
  "createdAt": "2025-12-04T10:00:00.000Z",
  "updatedAt": "2025-12-04T10:00:00.000Z"
}
```

**Status Codes:**
- `201` - Booking created successfully
- `400` - Invalid date range or room not available for selected dates
- `404` - Room not found

---

#### Cancel a Booking
**PATCH** `/bookings/:id/cancel`

**Auth Required:** GUEST (must be the booking owner) or ADMIN

**Response:**
```json
{
  "id": 1,
  "roomId": 1,
  "guestId": 3,
  "checkIn": "2025-12-10T00:00:00.000Z",
  "checkOut": "2025-12-12T00:00:00.000Z",
  "status": "CANCELLED",
  "createdAt": "2025-12-04T10:00:00.000Z",
  "updatedAt": "2025-12-04T11:00:00.000Z"
}
```

**Status Codes:**
- `200` - Booking cancelled successfully
- `403` - Not authorized to cancel this booking
- `404` - Booking not found

---

#### List My Bookings
**GET** `/bookings/me`

**Auth Required:** GUEST

**Response:**
```json
[
  {
    "id": 1,
    "roomId": 1,
    "guestId": 3,
    "checkIn": "2025-12-10T00:00:00.000Z",
    "checkOut": "2025-12-12T00:00:00.000Z",
    "status": "CONFIRMED",
    "createdAt": "2025-12-04T10:00:00.000Z",
    "updatedAt": "2025-12-04T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Successfully retrieved bookings

---

### 4. Admin

All admin endpoints require ADMIN role authentication.

#### List All Users
**GET** `/admin/users`

**Auth Required:** ADMIN

**Response:**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "passwordHash": "$2b$10$...",
    "role": "ADMIN",
    "createdAt": "2025-12-04T10:00:00.000Z",
    "updatedAt": "2025-12-04T10:00:00.000Z"
  },
  {
    "id": 2,
    "email": "owner@example.com",
    "passwordHash": "$2b$10$...",
    "role": "OWNER",
    "createdAt": "2025-12-04T10:00:00.000Z",
    "updatedAt": "2025-12-04T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Successfully retrieved users
- `403` - Forbidden (not admin)

---

#### List All Rooms
**GET** `/admin/rooms`

**Auth Required:** ADMIN

**Response:**
```json
[
  {
    "id": 1,
    "ownerId": 2,
    "name": "Deluxe Room",
    "price": 120,
    "capacity": 2,
    "status": "ACTIVE",
    "createdAt": "2025-12-04T10:00:00.000Z",
    "updatedAt": "2025-12-04T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Successfully retrieved rooms
- `403` - Forbidden (not admin)

---

#### List All Bookings
**GET** `/admin/bookings`

**Auth Required:** ADMIN

**Response:**
```json
[
  {
    "id": 1,
    "roomId": 1,
    "guestId": 3,
    "checkIn": "2025-12-10T00:00:00.000Z",
    "checkOut": "2025-12-12T00:00:00.000Z",
    "status": "CONFIRMED",
    "createdAt": "2025-12-04T10:00:00.000Z",
    "updatedAt": "2025-12-04T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Successfully retrieved bookings
- `403` - Forbidden (not admin)

---

## Data Models

### User
```typescript
{
  id: number;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "OWNER" | "GUEST";
  createdAt: Date;
  updatedAt: Date;
}
```

### Room
```typescript
{
  id: number;
  ownerId: number;
  name: string;
  price: number;
  capacity: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}
```

### Booking
```typescript
{
  id: number;
  roomId: number;
  guestId: number;
  checkIn: Date;
  checkOut: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Seeded Test Users

The database is pre-seeded with the following test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin123! | ADMIN |
| owner@example.com | Owner123! | OWNER |
| guest@example.com | Guest123! | GUEST |

---

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

Common status codes:
- `400` - Bad Request (validation errors, invalid data)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Testing with Postman

### Setup:
1. Import the endpoints into Postman
2. Create an environment with variable `baseUrl` = `http://localhost:3000`
3. Create a variable `token` for storing JWT token

### Flow:
1. **Register** a new user or **Login** with test credentials
2. Copy the `accessToken` from the response
3. Set it as Bearer token in Authorization header
4. Make requests to protected endpoints

### Example Authorization Header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Business Logic

### Room Availability
- When querying rooms with `checkIn` and `checkOut` dates, the system excludes rooms that have overlapping bookings with status `PENDING` or `CONFIRMED`
- A booking overlaps if: `checkIn < existingCheckOut AND checkOut > existingCheckIn`

### Booking Validation
- Check-in date must be before check-out date
- Cannot create booking for dates that overlap with existing confirmed/pending bookings
- Room must exist and be in ACTIVE status

### Permissions
- **OWNER**: Can create/update their own rooms, view bookings for their rooms
- **GUEST**: Can view rooms, create bookings, cancel their own bookings
- **ADMIN**: Can perform all operations, full system access

### Timestamps
- All entities automatically track `createdAt` and `updatedAt`
- Timestamps are managed by Prisma
