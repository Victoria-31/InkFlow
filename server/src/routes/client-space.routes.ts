import { Router } from 'express';
import { idParamSchema } from '@inkflow/shared';
import { getClientProject } from '../controllers/project.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateParams } from '../middlewares/validate.js';

// Every route below requires a CLIENT session
export const clientSpaceRouter = Router();

clientSpaceRouter.use(requireAuth, requireRole('CLIENT'));
clientSpaceRouter.get('/projects/:id', validateParams(idParamSchema), getClientProject);
