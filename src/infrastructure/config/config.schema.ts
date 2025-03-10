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
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required(),
});
