import { Router } from 'express';
import { getStudioProject } from '../controllers/project.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

// Artist space: every route below requires an ARTIST session
export const studioRouter = Router();

studioRouter.use(requireAuth, requireRole('ARTIST'));
studioRouter.get('/projects/:id', getStudioProject);
