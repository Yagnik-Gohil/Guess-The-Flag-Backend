import * as Joi from 'joi';

export const resetPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  otp: Joi.string().required().label('OTP'),
  password: Joi.string().required().label('Password'),
  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
    }),
});
