import { prisma } from '../db/prisma.js';

export function findPublicProfileByUsername(username: string) {
  return prisma.artist.findUnique({
    where: { username },
    select: {
      username: true,
      bio: true,
      city: true,
      portrait: true,
      workingSlots: true,
      account: { select: { firstName: true, lastName: true } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
    },
  });
}

export function findByUsername(username: string) {
  return prisma.artist.findUnique({
    where: { username },
    select: { id: true, workingSlots: true },
  });
}
