import { prisma } from '../db/prisma.js';

export function findAll() {
  return prisma.tag.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });
}

export function countByIds(ids: number[]) {
  return prisma.tag.count({ where: { id: { in: ids } } });
}
