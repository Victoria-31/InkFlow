import { Router } from 'express';
import { loginSchema } from '@inkflow/shared';
import { validateBody } from '../middlewares/validate.js';
import authActions from '../middlewares/auth-actions.js';

export const loginRouter = Router();

loginRouter.post('/login', validateBody(loginSchema), authActions.login);
