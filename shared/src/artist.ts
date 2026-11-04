import type { Availability } from './availability.js';
import type { ProjectStatus } from './project-status.js';

export type Tag = { id: number; name: string };

// Response of GET /api/artists/:username
export type PublicArtist = {
  username: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  city: string | null;
  portrait: string | null;
  workingSlots: Availability[];
  specialties: Tag[];
  styles: Tag[];
};

// Response of POST /api/artists/:username/projects
export type CreatedProjectRequest = { id: number; status: ProjectStatus };
