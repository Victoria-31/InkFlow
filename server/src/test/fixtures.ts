import type { Prisma, Role } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { AUTH_COOKIE, signAuthToken } from '../utils/session.js';

// Test data helpers: each test file passes a unique prefix so files never share rows

export function createArtistAccount(prefix: string) {
  return prisma.account.create({
    data: {
      firstName: 'Ren',
      lastName: 'Test',
      email: `${prefix}@example.com`,
      passwordHash: 'not-a-real-hash',
      role: 'ARTIST',
      artist: { create: { username: prefix } },
    },
    include: { artist: true },
  });
}

export function createClientAccount(prefix: string) {
  return prisma.account.create({
    data: { firstName: 'Léa', lastName: 'Test', email: `${prefix}@example.com`, passwordHash: 'not-a-real-hash', role: 'CLIENT' },
  });
}

// overrides: the fields a test cares about (date, budget…), the rest stays valid and neutral
export function createProject(
  artistId: number,
  clientId: number | null = null,
  overrides: Partial<Prisma.ProjectUncheckedCreateInput> = {},
) {
  return prisma.project.create({
    data: {
      artistId,
      clientId,
      bodyArea: 'Nuque',
      size: '8 cm',
      clientNote: 'Un ensō.',
      prospectFirstName: 'Léa',
      prospectLastName: 'Martin',
      prospectEmail: 'lea@example.com',
      ...overrides,
    },
  });
}

// Signs a session directly, without going through POST /login
export function sessionCookie(accountId: number, role: Role) {
  return `${AUTH_COOKIE}=${signAuthToken({ sub: String(accountId), role })}`;
}
