import type { Request, Response } from 'express';
import type { ProjectSummary } from '@inkflow/shared';
import * as projectService from '../services/project.service.js';

type ProjectParams = { id: string };

// req.account is always set here: the studio and client routers run requireAuth first
export async function getStudioProject(req: Request<ProjectParams, ProjectSummary>, res: Response<ProjectSummary>) {
  res.json(await projectService.getArtistProject(Number(req.params.id), req.account!.id));
}

export async function getClientProject(req: Request<ProjectParams, ProjectSummary>, res: Response<ProjectSummary>) {
  res.json(await projectService.getClientProject(Number(req.params.id), req.account!.id));
}
