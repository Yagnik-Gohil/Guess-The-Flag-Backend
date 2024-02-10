import * as Joi from 'joi';

export const userEditForAdminSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected', 'blocked').label('Status'),
});
