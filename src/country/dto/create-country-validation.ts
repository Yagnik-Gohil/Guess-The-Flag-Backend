import * as Joi from 'joi';

export const countryCreateSchema = Joi.object({
  country_code: Joi.string().required(),
  name: Joi.string().required(),
});
