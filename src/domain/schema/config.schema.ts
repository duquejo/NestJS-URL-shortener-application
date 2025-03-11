import * as Joi from 'joi';

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCT = 'production',
  TEST = 'test',
}

export const configSchema = Joi.object({
  PORT: Joi.number(),
  DATABASE_NAME: Joi.string().required(),
  URL_ENCODER_LENGTH: Joi.number().required(),
  URL_ENCODER_ALPHABET: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required(),
});

export const urlSchema = Joi.string().min(7).max(15).required().messages({
  'string.min': 'The URL length must be at least {{#limit}} characters long.',
  'string.max': 'The URL length exceeds the length conditions',
});
