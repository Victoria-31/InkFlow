import type { Request, Response } from 'express';
import type { ArtistProjectDetail, ArtistProjectListItem, ProjectListQuery, ProjectSummary } from '@inkflow/shared';
import { getAccount } from '../middlewares/auth.js';
import * as projectService from '../services/project.service.js';

// id is already checked by validateParams(idParamSchema)
type ProjectParams = { id: string };
type NoParams = Record<string, never>;

// status is already checked by validateQuery(projectListQuerySchema)
export async function listArtistProjects(
  req: Request<NoParams, ArtistProjectListItem[], unknown, ProjectListQuery>,
  res: Response<ArtistProjectListItem[]>,
) {
  res.json(await projectService.listArtistProjects(getAccount(req).id, req.query.status));
}

export async function getArtistProject(req: Request<ProjectParams, ArtistProjectDetail>, res: Response<ArtistProjectDetail>) {
  res.json(await projectService.getArtistProject(Number(req.params.id), getAccount(req).id));
}

export async function getClientProject(req: Request<ProjectParams, ProjectSummary>, res: Response<ProjectSummary>) {
  res.json(await projectService.getClientProject(Number(req.params.id), getAccount(req).id));
}
