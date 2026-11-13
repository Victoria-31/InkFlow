import cookieParser from 'cookie-parser';
import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import { notFound } from './middlewares/not-found.js';
import { artistRouter } from './routes/artist.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { clientRouter } from './routes/client.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { studioRouter } from './routes/studio.routes.js';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/health', healthRouter);
app.use('/api/artists', artistRouter);
app.use('/api/auth', authRouter);
app.use('/api/studio', studioRouter);
app.use('/api/client', clientRouter);
app.use('/api', notFound);

// Must stay last: catches errors from every route, including async ones (Express 5)
app.use(errorHandler);
