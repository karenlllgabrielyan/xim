import { Column, Entity } from 'typeorm';
import { RawBaseEntity } from '../Utils/db';


@Entity('users')
export class UsersEntity extends RawBaseEntity {
  @Column({ type: 'varchar', length: 512, nullable: false })
    email: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
    name: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
    surname: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
    password: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
    access_token: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
    refresh_token: string;
}
