import * as Joi from 'joi';

export const signupOtpSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  otp: Joi.string().required().label('OTP'),
});
