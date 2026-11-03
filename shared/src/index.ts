// Must stay in sync with the ProjectStatus enum in server/prisma/schema.prisma
export const PROJECT_STATUSES = [
  'REQUEST', 'FRAMING', 'QUOTE_SENT', 'QUOTE_ACCEPTED', 'AWAITING_DEPOSIT',
  'CREATION', 'SESSION_DONE', 'COMPLETED', 'ARCHIVED', 'CANCELLED',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];