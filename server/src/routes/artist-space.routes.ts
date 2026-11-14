import { Router } from 'express';
import { idParamSchema, projectListQuerySchema } from '@inkflow/shared';
import { getArtistProject, listArtistProjects } from '../controllers/project.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateParams, validateQuery } from '../middlewares/validate.js';

// Every route below requires an ARTIST session
export const artistSpaceRouter = Router();

artistSpaceRouter.use(requireAuth, requireRole('ARTIST'));
artistSpaceRouter.get('/projects', validateQuery(projectListQuerySchema), listArtistProjects);
artistSpaceRouter.get('/projects/:id', validateParams(idParamSchema), getArtistProject);
