import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entity/base.entity';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import { Otp } from 'src/otp/entities/otp.entity';
import { DefaultStatus } from 'src/shared/constants/enum';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'character varying', length: 32 })
  name: string;

  @Column({ type: 'character varying' })
  email: string;

  @Column({
    type: 'enum',
    enum: [DefaultStatus.ACTIVE, DefaultStatus.IN_ACTIVE],
    default: DefaultStatus.IN_ACTIVE,
  })
  status: string;

  @OneToMany(() => UserToken, (user_token) => user_token.user)
  user_token: UserToken[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otp: Otp[];
}
