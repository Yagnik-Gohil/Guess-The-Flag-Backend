import * as Joi from 'joi';

export const permissionCreateSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('role', 'section').required(),
});
