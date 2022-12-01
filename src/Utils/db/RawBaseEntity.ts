import {
  Column,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';


export class RawBaseEntity {
  constructor(uuid: string) {
    this.uuid = uuid;
    const now = new Date();
    this.created_at = new Date(now);
    this.updated_at = new Date(now);
    this.deleted_at = null;
  }


  @Index({ unique: true })
  @PrimaryColumn({ type: 'varchar', length: 36, nullable: false })
    uuid!: string;

  @Column({ type: 'datetime', nullable: false })
    created_at!: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
    updated_at!: Date;

  @Index()
  @Column({ type: 'datetime', nullable: true })
    deleted_at!: null | Date;
}
