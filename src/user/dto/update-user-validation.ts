import * as Joi from 'joi';
import { DefaultStatus } from 'src/shared/constants/enum';

export const userEditForAdminSchema = Joi.object({
  status: Joi.string()
    .valid(DefaultStatus.ACTIVE, DefaultStatus.IN_ACTIVE)
    .label('Status'),
});
