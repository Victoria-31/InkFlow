import { Router } from 'express';
import { projectRequestSchema } from '@inkflow/shared';
import { createProject, getArtist } from '../controllers/artist.controller.js';
import { validateBody } from '../middlewares/validate.js';

export const artistRouter = Router();

artistRouter.get('/:username', getArtist);
artistRouter.post('/:username/projects', validateBody(projectRequestSchema), createProject);
