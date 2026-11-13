import type { ProjectSummary } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';
import * as projectRepository from '../repositories/project.repository.js';

// PostgreSQL INT upper bound: a larger id would make Prisma throw instead of finding nothing
const MAX_ID = 2_147_483_647;

function isValidId(id: number) {
  return Number.isInteger(id) && id > 0 && id <= MAX_ID;
}

// Another account's project gets the same 404 as a missing one, so its existence is never revealed
function toSummary(project: ProjectSummary | null): ProjectSummary {
  if (!project) {
    throw new HttpError(404, 'project_not_found');
  }
  return { id: project.id, status: project.status };
}

export async function getArtistProject(projectId: number, accountId: number) {
  const project = isValidId(projectId) ? await projectRepository.findForArtist(projectId, accountId) : null;
  return toSummary(project);
}

export async function getClientProject(projectId: number, accountId: number) {
  const project = isValidId(projectId) ? await projectRepository.findForClient(projectId, accountId) : null;
  return toSummary(project);
}
