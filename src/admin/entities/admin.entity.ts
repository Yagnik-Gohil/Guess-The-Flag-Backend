import { Role } from 'src/role/entities/role.entity';
import { BaseEntity } from '../../shared/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import { DefaultStatus } from 'src/shared/constants/enum';
import { Otp } from 'src/otp/entities/otp.entity';

@Entity()
export class Admin extends BaseEntity {
  @Column({
    type: 'enum',
    enum: [DefaultStatus.ACTIVE, DefaultStatus.IN_ACTIVE],
    default: DefaultStatus.ACTIVE,
  })
  status: string;

  @Column({ type: 'character varying', length: 32 })
  name: string;

  @Column({ type: 'character varying' })
  email: string;

  @Column({ type: 'character varying' })
  password: string;

  @Column({ type: 'character varying', length: 5, nullable: true })
  country_code: string;

  @Column({ type: 'character varying', length: 15, nullable: true })
  contact_number: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'fk_role' })
  role: Role;

  @OneToMany(() => UserToken, (user_token) => user_token.admin)
  user_token: UserToken[];

  @OneToMany(() => Otp, (otp) => otp.admin)
  otp: Otp[];
}
