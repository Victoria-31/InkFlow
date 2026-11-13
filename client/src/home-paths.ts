import type { Role } from '@inkflow/shared';

// Landing page of each role's space, after login or when opening the other role's space
export const HOME_PATHS: Record<Role, string> = {
  ARTIST: '/artist',
  CLIENT: '/my-projects',
};
