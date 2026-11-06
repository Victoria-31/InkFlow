import { prisma } from "../db/prisma.js";

  export function findByEmail(email: string) {
  return prisma.account.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });

// export function findByEmailWithPassword(email: string, passwordHash: string) {
//   return prisma.account.findUnique({
//     where: { email },
//     select: { id: true, email: true, passwordHash: true },
//   });
}