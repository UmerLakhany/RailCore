import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config/env.js';
import healthRoutes from './modules/health/health.routes.js';


const app = express();

app.use(helmet())

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/${env.apiPrefix}/health`, healthRoutes)

export default app;