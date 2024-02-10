import * as Joi from 'joi';

export const roleCreateSchema = Joi.object({
  name: Joi.string().required().label('Name'),
  description: Joi.string().required().label('Description'),
  is_admin: Joi.boolean().required().label('Is Admin'),
  role_permission: Joi.array()
    .items(Joi.string().uuid().required())
    .required()
    .label('Role Permission'),
  section_permission: Joi.array()
    .items(Joi.string().uuid().required())
    .required()
    .label('Section Permission'),
});
