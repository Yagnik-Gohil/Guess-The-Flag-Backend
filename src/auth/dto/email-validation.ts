import * as Joi from 'joi';

export const emailValidationSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
});
