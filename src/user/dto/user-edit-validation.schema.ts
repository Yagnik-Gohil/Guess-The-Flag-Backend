import * as Joi from 'joi';

export const userEditSchema = Joi.object({
  email: Joi.string().email().label('Email'),
  name: Joi.string().label('First name'),
});
