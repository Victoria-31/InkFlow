import type { Request, Response } from 'express';
import type { ProjectRequest } from '@inkflow/shared';
import * as artistService from '../services/artist.service.js';
import * as projectRequestService from '../services/project-request.service.js';

type ArtistParams = { username: string };
type PublicArtist = Awaited<ReturnType<typeof artistService.getPublicArtist>>;
type CreatedProject = Awaited<ReturnType<typeof projectRequestService.createProjectRequest>>;

export async function getArtist(req: Request<ArtistParams, PublicArtist>, res: Response<PublicArtist>) {
  res.json(await artistService.getPublicArtist(req.params.username));
}

export async function createProject(req: Request<ArtistParams, CreatedProject, ProjectRequest>, res: Response<CreatedProject>) {
  const project = await projectRequestService.createProjectRequest(req.params.username, req.body);
  res.status(201).json(project);
}
