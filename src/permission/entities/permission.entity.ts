import { DefaultStatus } from 'src/shared/constants/enum';
import { BaseEntity } from '../../shared/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Permission extends BaseEntity {
  @Column({
    type: 'enum',
    enum: [DefaultStatus.ACTIVE, DefaultStatus.IN_ACTIVE],
    default: DefaultStatus.ACTIVE,
  })
  status: string;

  @Column({ type: 'character varying' })
  name: string;

  @Column({ type: 'enum', enum: ['role', 'section'] })
  type: string;
}
