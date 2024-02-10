import * as Joi from 'joi';

export const loginOtpSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  otp: Joi.string().required().label('OTP'),
  device_id: Joi.string().required().label('Device Id'),
  device_type: Joi.string()
    .valid('ios', 'android', 'web')
    .required()
    .label('Device Type'),
  firebase_token: Joi.string().required().label('Firebase Token'),
});
