import { DefaultStatus } from 'src/shared/constants/enum';
import { Admin } from '../../admin/entities/admin.entity';
import { BaseEntity } from '../../shared/entity/base.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class UserToken extends BaseEntity {
  @Column({
    type: 'enum',
    enum: [DefaultStatus.ACTIVE, DefaultStatus.IN_ACTIVE],
    default: DefaultStatus.ACTIVE,
  })
  status: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @ManyToOne(() => Admin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_admin' })
  admin: Admin;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'text', nullable: true })
  firebase_token: string;

  @Column({ type: 'character varying', nullable: true })
  device_id: string;

  @Column({ type: 'character varying', nullable: true })
  device_name: string;

  @Column({ type: 'enum', enum: ['ios', 'android', 'web'], nullable: true })
  device_type: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  login_time: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  logout_time: string;
}
