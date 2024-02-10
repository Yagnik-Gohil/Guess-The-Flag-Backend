import * as Joi from 'joi';

export const roleUpdateSchema = Joi.object({
  name: Joi.string().label('Name'),
  description: Joi.string().label('Description'),
  is_admin: Joi.boolean().label('Is Admin'),
  role_permission: Joi.array()
    .items(Joi.string().uuid())
    .label('Role Permission'),
  section_permission: Joi.array()
    .items(Joi.string().uuid())
    .label('Section Permission'),
});
