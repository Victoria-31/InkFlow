// Must stay in sync with the Role enum in server/prisma/schema.prisma
export type Role = 'ARTIST' | 'CLIENT';

// Response of POST /api/auth/login
export type LoginResult = { role: Role };

// Response of GET /api/auth/me
export type CurrentAccount = { id: number; role: Role };
