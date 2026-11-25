import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import v1Routes from './routes/v1';
import { errorHandler, handleAPIResponse } from './middlewares';
import SequelizeClass, { connectDatabase } from '../settings/orm/sequelize';

const app: Express = express();
const port = Number(process.env.PORT) || 5001;

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json({ limit: '100kb' }));
app.use(handleAPIResponse);

app.get('/health', async (_req, res) => {
  try {
    await SequelizeClass.getInstance().sequelize.authenticate();
    res.json({ status: 'ok', database: 'up' });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'down' });
  }
});

app.use('/api/v1', v1Routes);

app.use((req, res) => res.generalError(`Route ${req.method} ${req.originalUrl} not found`, null, 404));
app.use(errorHandler);

async function start() {
  await connectDatabase();

  const server = app.listen(port, () => {
    console.log(`RailCore API listening on port ${port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await SequelizeClass.getInstance().close();
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
