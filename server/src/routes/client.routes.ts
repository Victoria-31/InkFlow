import { Router } from 'express';
import { getClientProject } from '../controllers/project.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

// Client space: every route below requires a CLIENT session
export const clientRouter = Router();

clientRouter.use(requireAuth, requireRole('CLIENT'));
clientRouter.get('/projects/:id', getClientProject);
