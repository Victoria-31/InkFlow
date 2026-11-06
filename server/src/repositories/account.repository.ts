import { prisma } from "../db/prisma.js";

  export function findByEmailWithPassword(email: string, password: string) {
  return prisma.account.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });
}