import type { ArtistProjectDetail, ArtistProjectListItem, ProjectStatus, ProjectSummary } from '@inkflow/shared';
import { HttpError } from '../errors/http-error.js';
import * as projectRepository from '../repositories/project.repository.js';

type ArtistProjectRow = Awaited<ReturnType<typeof projectRepository.findAllForArtist>>[number];

// Explicit list: only these fields leave the API
function toArtistListItem(project: ArtistProjectRow): ArtistProjectListItem {
  return {
    id: project.id,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    firstName: project.prospectFirstName,
    lastName: project.prospectLastName,
    bodyArea: project.bodyArea,
    styles: project.tags.map(({ tag }) => tag),
    budgetMin: project.clientBudgetMin?.toNumber() ?? null,
    budgetMax: project.clientBudgetMax?.toNumber() ?? null,
  };
}

export async function listArtistProjects(accountId: number, status?: ProjectStatus): Promise<ArtistProjectListItem[]> {
  const projects = await projectRepository.findAllForArtist(accountId, status);
  return projects.map(toArtistListItem);
}

// Same 404 as a missing project: never reveal that it exists
export async function getArtistProject(projectId: number, accountId: number): Promise<ArtistProjectDetail> {
  const project = await projectRepository.findForArtist(projectId, accountId);
  if (!project) {
    throw new HttpError(404, 'project_not_found');
  }
  return {
    ...toArtistListItem(project),
    email: project.prospectEmail,
    size: project.size,
    description: project.clientNote,
    availability: project.clientAvailability,
    flexibleSchedule: project.clientFlexibleSchedule,
  };
}

export async function getClientProject(projectId: number, accountId: number): Promise<ProjectSummary> {
  const project = await projectRepository.findForClient(projectId, accountId);
  if (!project) {
    throw new HttpError(404, 'project_not_found');
  }
  return { id: project.id, status: project.status };
}
