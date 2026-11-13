import { prisma } from '../db/prisma.js';

export function findByEmail(email: string) {
  return prisma.account.findUnique({
    where: { email },
    select: { id: true, role: true, passwordHash: true },
  });
}
