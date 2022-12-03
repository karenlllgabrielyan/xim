import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesEntity } from './files.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { File_DTO } from './dto';
import { filesize } from 'filesize';
import * as fs from 'fs';


@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
  ) { }

  async __transformToFile_DTO(files: Array<FilesEntity>)
  :Promise<Array<File_DTO>> {
    return files.map(file => ({
      uuid: file.uuid,
      name: file.name,
      ext: file.ext,
      mime_type: file.mime_type,
      file_size: file.file_size,
      owner_uuid: file.owner_uuid,
      uploaded: file.updated_at,
    }));
  }

  // --------------------------------------------------------------- SAVE FILE DATA
  async saveFileData(args: IFileData)
  :Promise<{ uuid: string }> {
    const uuid = randomUUID();

    const file = new FilesEntity(uuid);

    file.owner_uuid = args.owner_uuid;
    file.name = args.filename;
    file.ext = args.ext;
    file.file_size = String(filesize(args.file_size, { base: 2, standard: 'jedec' }));
    file.mime_type = args.mime_type;
    await this.filesRepository.save(file);

    return {
      uuid,
    };
  }

  // --------------------------------------------------------------- GET FILES DATA LIST
  async getList(args: { limit: number; offset: number}) {
    const files_data = await this.filesRepository.find({
      skip: args.offset,
      take: args.limit,
    });

    return (await this.__transformToFile_DTO(files_data));
  }

  // --------------------------------------------------------------- GET FILE DATA BY UUID
  async getFileData(uuid: string) {
    const file_data = await this.filesRepository.findOne({
      where: {
        uuid,
      },
    });

    if (!file_data) {
      throw new HttpException(`File ${uuid} not found`, HttpStatus.NOT_FOUND);
    }

    return (await this.__transformToFile_DTO([file_data]))[0];
  }

  // --------------------------------------------------------------- DELETE FILE BY UUID
  async deleteFile(uuid: string) {
    const file_data = await this.filesRepository.findOne({
      where: {
        uuid,
      },
    });

    if (!file_data) {
      throw new HttpException(`File ${uuid} not found`, HttpStatus.NOT_FOUND);
    }

    await this.__removeFile(file_data.name);

    await this.filesRepository.remove(file_data);

    return {
      message: `${file_data.name} has deleted`,
    };
  }

  // --------------------------------------------------------------- UPDATE FILE BY UUID
  async updateFile(args: {
    uuid: string;
    file_data: IFileData;
  }) {
    const old_file = await this.filesRepository.findOne({
      where: {
        uuid: args.uuid,
      },
    });

    if (!old_file) {
      await this.__removeFile(args.file_data.filename);
      throw new HttpException(`File ${args.uuid} not found`, HttpStatus.NOT_FOUND);
    }

    await this.__removeFile(old_file.name);

    old_file.name = args.file_data.filename;
    old_file.ext = args.file_data.ext;
    old_file.file_size = String(filesize(args.file_data.file_size, { base: 2, standard: 'jedec' }));
    old_file.mime_type = args.file_data.mime_type;
    old_file.owner_uuid = args.file_data.owner_uuid;
    old_file.updated_at = new Date();

    await this.filesRepository.save(old_file);
    return (await this.__transformToFile_DTO([old_file]))[0];
  }

  // ---------------------------------- REMOVE FILE FROM FS
  async __removeFile(filename: string) {
    try {
      fs.unlink(`./files/${filename}`, err => {
        console.error(err);
      });
    }
    catch (e) { }
  }
}

export interface IFileData {
  owner_uuid: string;
  ext: string;
  filename: string;
  mime_type: string;
  file_size: number;
}
