import * as Joi from 'joi';
import { CONSTANT } from '../../shared/constants/message';

export const adminCreateSchema = Joi.object({
  first_name: Joi.string().required().label('First name'),
  last_name: Joi.string().required().label('Last name'),
  email: Joi.string().required().email().label('Email'),
  password: Joi.string()
    .required()
    .min(8)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/i)
    .label('Password')
    .messages({
      'string.pattern.base': CONSTANT.VALIDATION.PASSWORD_PATTERN,
    }),
  country_code: Joi.string()
    .regex(/^\+\d+$/)
    .messages({
      'string.pattern.base': CONSTANT.VALIDATION.COUNTRY_CODE,
    })
    .label('Country code'),
  contact_number: Joi.string()
    .regex(/^\d{1,15}$/)
    .label('Contact number')
    .messages({
      'string.pattern.base': CONSTANT.VALIDATION.CONTACT_FORMAT,
    }),
  role: Joi.string().uuid().required().label('Role'),
});
