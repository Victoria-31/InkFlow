// Must stay in sync with the Availability enum in server/prisma/schema.prisma
export const AVAILABILITIES = [
  'MON_AM',
  'MON_PM',
  'TUE_AM',
  'TUE_PM',
  'WED_AM',
  'WED_PM',
  'THU_AM',
  'THU_PM',
  'FRI_AM',
  'FRI_PM',
  'SAT_AM',
  'SAT_PM',
  'SUN_AM',
  'SUN_PM',
] as const;

export type Availability = (typeof AVAILABILITIES)[number];
