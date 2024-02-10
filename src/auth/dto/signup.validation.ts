import * as Joi from 'joi';

export const userCreateSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  name: Joi.string().required().label('Name'),
  tax_number: Joi.string().required().label('Tax Number'),
});
