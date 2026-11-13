import type { ProjectStatus } from './project-status.js';

// Response of GET /api/artist/projects/:id and GET /api/client/projects/:id
export type ProjectSummary = { id: number; status: ProjectStatus };
