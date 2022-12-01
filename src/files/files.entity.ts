import { Column, Entity } from 'typeorm';
import { RawBaseEntity } from '../Utils/db';


@Entity('files')
export class FilesEntity extends RawBaseEntity {
  @Column({ type: 'varchar', length: 512, nullable: false })
    name: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
    ext: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
    mime_type: string;

  @Column({ type: 'integer', nullable: false })
    file_size: number;

  @Column({ type: 'varchar', length: 512, nullable: false })
    owner_uuid: string;
}
