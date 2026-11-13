import { Router } from 'express';
import { idParamSchema } from '@inkflow/shared';
import { getArtistProject } from '../controllers/project.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateParams } from '../middlewares/validate.js';

// Logged-in artist's space: every route below requires an ARTIST session
export const artistSpaceRouter = Router();

artistSpaceRouter.use(requireAuth, requireRole('ARTIST'));
artistSpaceRouter.get('/projects/:id', validateParams(idParamSchema), getArtistProject);
