import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as path from 'path';
import { AuthGuard } from '../authorization/auth-guard.service';
import { FilesService } from './files.service';
import * as fs from 'fs';


@ApiTags('Files')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('file')
export class FilesController {
  constructor(
    private files_svc: FilesService,
  ) { }

  @ApiOperation({ summary: 'Upload file' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (fs.existsSync(`./files/${file.originalname}`)) {
        req.fileValidationError = 'Forbidden extension';
        return cb(new HttpException(`File '${file.originalname}' already exist`, HttpStatus.NOT_ACCEPTABLE), false);
      }
      return cb(null, true);
    },
    storage: diskStorage({
      destination: './files',
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      },
    }),
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: IReq) {
    return await this.files_svc.saveFileData({
      owner_uuid: req.user.uuid,
      filename: file.filename,
      ext: path.extname(file.originalname),
      mime_type: file.mimetype,
      file_size: file.size,
    });
  }
}

interface IReq {
  user: {
    uuid: string;
  };
  file: {
    exist: boolean;
  };
}
