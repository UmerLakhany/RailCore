import 'dotenv/config';
import { envSchema } from './validation.js';

const {error, value} = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
});

if (error) {
  throw new Error(`Environment validation failed: ${error.message}`);
}

export const env = {
  nodeEnv: value.NODE_ENV as string,
  port: value.PORT as number,
  apiPrefix: value.API_PREFIX as string,
  corsOrigin: value.CORS_ORIGIN as string,
}