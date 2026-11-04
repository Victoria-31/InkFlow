import { PrismaClient } from '@prisma/client';

// One client for the whole app: each instance opens its own connection pool
export const prisma = new PrismaClient();
