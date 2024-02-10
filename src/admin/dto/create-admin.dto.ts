import { Role } from 'src/role/entities/role.entity';

export class CreateAdminDto {
  name: string;
  email: string;
  password: string;
  country_code: string;
  contact_number: string;
  role: Role;
}
