import * as Joi from 'joi';

export const otpVerifySchema = Joi.object({
  type: Joi.string()
    .valid('signup', 'login', 'forgot_password')
    .required()
    .label('Type'),
  email: Joi.string().email().required().label('Email'),
  otp: Joi.number().required().label('Title'),
});
