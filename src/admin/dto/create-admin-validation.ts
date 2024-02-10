import * as Joi from 'joi';
import { CONSTANT } from '../../shared/constants/message';

export const adminCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string()
    .required()
    .min(8)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/i)
    .messages({
      'string.pattern.base': CONSTANT.VALIDATION.PASSWORD_PATTERN,
    }),
  country_code: Joi.string()
    .regex(/^\+\d+$/)
    .messages({
      'string.pattern.base': CONSTANT.VALIDATION.COUNTRY_CODE,
    }),
  contact_number: Joi.string()
    .regex(/^\d{1,15}$/)

    .messages({
      'string.pattern.base': CONSTANT.VALIDATION.CONTACT_FORMAT,
    }),
  role: Joi.string().uuid().required(),
});
