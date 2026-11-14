import { z } from 'zod';
import type { Tag } from './artist.js';
import type { Availability } from './availability.js';
import { PROJECT_STATUSES, type ProjectStatus } from './project-status.js';

// Response of GET /api/client/projects/:id
export type ProjectSummary = { id: number; status: ProjectStatus };

// Query of GET /api/artist/projects
export const projectListQuerySchema = z.object({
  status: z.enum(PROJECT_STATUSES, 'invalid_status').optional(),
});
export type ProjectListQuery = z.output<typeof projectListQuerySchema>;

// Item of GET /api/artist/projects (dates as ISO strings)
export type ArtistProjectListItem = {
  id: number;
  status: ProjectStatus;
  createdAt: string;
  firstName: string;
  lastName: string;
  bodyArea: string;
  styles: Tag[];
  budgetMin: number | null;
  budgetMax: number | null;
};

// Response of GET /api/artist/projects/:id
export type ArtistProjectDetail = ArtistProjectListItem & {
  email: string;
  size: string;
  description: string;
  availability: Availability[];
  flexibleSchedule: boolean;
};
