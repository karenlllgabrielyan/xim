import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesEntity } from './files.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';


@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
  ) { }

  async saveFileData(args: {
    owner_uuid: string;
    ext: string;
    filename: string;
    mime_type: string;
    file_size: number;
  })
  :Promise<{ uuid: string }> {
    const uuid = randomUUID();

    const file = new FilesEntity(uuid);

    file.owner_uuid = args.owner_uuid;
    file.name = args.filename;
    file.ext = args.ext;
    file.file_size = args.file_size;
    file.mime_type = args.mime_type;
    await this.filesRepository.save(file);

    return {
      uuid,
    };
  }
}
