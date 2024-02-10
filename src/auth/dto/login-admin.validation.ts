import * as Joi from 'joi';

export const loginAdminSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().label('Password'),
  device_id: Joi.string().label('Device Id'),
  device_type: Joi.string().valid('ios', 'android', 'web').label('Device Type'),
});
