import * as Joi from 'joi';

export const countryUpdateSchema = Joi.object({
  country_code: Joi.string(),
  name: Joi.string(),
});
