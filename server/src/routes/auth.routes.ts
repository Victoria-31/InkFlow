import { Router } from 'express';
import { loginSchema } from '@inkflow/shared';
import { validateBody } from '../middlewares/validate.js';
import { login, logout } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/logout', logout);
