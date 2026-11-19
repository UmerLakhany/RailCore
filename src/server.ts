import { env } from './config/env.js';
import app from "./app.js";

const server = app.listen(env.port, () => {
console.log(`Server running on port ${env.port}`);
})

const shutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down server...`);

  server.close(()=>{
    console.log('Server closed.');
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));