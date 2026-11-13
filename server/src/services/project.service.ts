import type { ProjectSummary } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';
import * as projectRepository from '../repositories/project.repository.js';

// Another account's project gets the same 404 as a missing one, so its existence is never revealed
export async function getArtistProject(projectId: number, accountId: number): Promise<ProjectSummary> {
  const project = await projectRepository.findForArtist(projectId, accountId);
  if (!project) {
    throw new HttpError(404, 'project_not_found');
  }
  return { id: project.id, status: project.status };
}

export async function getClientProject(projectId: number, accountId: number): Promise<ProjectSummary> {
  const project = await projectRepository.findForClient(projectId, accountId);
  if (!project) {
    throw new HttpError(404, 'project_not_found');
  }
  return { id: project.id, status: project.status };
}
