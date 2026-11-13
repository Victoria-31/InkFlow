import cookieParser from 'cookie-parser';
import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import { notFound } from './middlewares/not-found.js';
import { artistSpaceRouter } from './routes/artist-space.routes.js';
import { artistRouter } from './routes/artist.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { clientSpaceRouter } from './routes/client-space.routes.js';
import { healthRouter } from './routes/health.routes.js';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/health', healthRouter);
app.use('/api/artists', artistRouter);
app.use('/api/auth', authRouter);
// Private spaces, singular: the logged-in account's own space, unlike the public /api/artists collection
app.use('/api/artist', artistSpaceRouter);
app.use('/api/client', clientSpaceRouter);
app.use('/api', notFound);

// Must stay last: catches errors from every route, including async ones (Express 5)
app.use(errorHandler);
