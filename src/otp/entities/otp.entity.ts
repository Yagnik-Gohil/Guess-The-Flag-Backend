import { DefaultStatus, OtpType } from 'src/shared/constants/enum';
import { BaseEntity } from '../../shared/entity/base.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Admin } from 'src/admin/entities/admin.entity';

@Entity()
export class Otp extends BaseEntity {
  @Column({
    type: 'enum',
    enum: [DefaultStatus.ACTIVE, DefaultStatus.IN_ACTIVE],
    default: DefaultStatus.ACTIVE,
  })
  status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fk_user' })
  user: User;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'fk_admin' })
  admin: Admin;

  @Column({ type: 'integer' })
  otp: number;

  @Column({ type: 'character varying', length: 50 })
  email: string;

  @Column({
    type: 'enum',
    enum: [OtpType.FORGOT_PASSWORD, OtpType.LOGIN, OtpType.SIGNUP],
  })
  type: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'integer' })
  expire_at: number;
}
