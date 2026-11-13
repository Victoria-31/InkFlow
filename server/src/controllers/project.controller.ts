import type { Request, Response } from 'express';
import type { ProjectSummary } from '@inkflow/shared';
import { getAccount } from '../middlewares/auth.js';
import * as projectService from '../services/project.service.js';

// id is already checked by validateParams(idParamSchema)
type ProjectParams = { id: string };

export async function getArtistProject(req: Request<ProjectParams, ProjectSummary>, res: Response<ProjectSummary>) {
  res.json(await projectService.getArtistProject(Number(req.params.id), getAccount(req).id));
}

export async function getClientProject(req: Request<ProjectParams, ProjectSummary>, res: Response<ProjectSummary>) {
  res.json(await projectService.getClientProject(Number(req.params.id), getAccount(req).id));
}
