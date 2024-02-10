import * as Joi from 'joi';

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
});
