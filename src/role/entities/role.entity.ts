import { Admin } from 'src/admin/entities/admin.entity';
import { BaseEntity } from '../../shared/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { DefaultStatus } from 'src/shared/constants/enum';

@Entity()
export class Role extends BaseEntity {
  @Column({
    type: 'enum',
    enum: [DefaultStatus.ACTIVE, DefaultStatus.IN_ACTIVE],
    default: DefaultStatus.ACTIVE,
  })
  status: string;

  @Column({ type: 'character varying' })
  name: string;

  @Column({ type: 'character varying' })
  description: string;

  @Column({ type: 'boolean' })
  is_admin: boolean;

  @Column('uuid', { array: true })
  role_permission: string[];

  @Column('uuid', { array: true })
  section_permission: string[];

  @OneToMany(() => Admin, (admin) => admin.role)
  admin: Admin[];
}
