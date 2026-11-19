import Joi from "joi";

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
  .valid('development', 'production', 'test')
  .default('development'),

  PORT: Joi.number()
  .default(3000),

  API_PREFIX: Joi.string()
  .default('api/v1'),

  CORS_ORIGIN: Joi.string()
  .default('http://localhost:3001')
})