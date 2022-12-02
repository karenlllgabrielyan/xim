import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  StreamableFile,
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
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { AuthGuard } from '../authorization/auth-guard.service';
import { FilesService } from './files.service';
import {
  File_getMany_ReqQuery_DTO,
  File_ReqParam_DTO,
  File_DTO,
} from './dto';
import { createReadStream } from 'fs';
import { join } from 'path';


@ApiTags('Files')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('file')
export class FilesController {
  constructor(
    private files_svc: FilesService,
  ) { }

  // ---------------------------------------------------------------- UPLOAD FILE
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

  // ---------------------------------------------------------------- GET LIST
  @ApiOperation({ summary: 'Get list of files data' })
  @ApiResponse({ status: 200, type: [File_DTO] })
  @Get('list')
  async getList(@Query() query: File_getMany_ReqQuery_DTO) {
    const limit = query.limit ?? 10;
    const offset = limit * (query.page && query.page >= 1 ? query.page - 1 : 0);
    return this.files_svc.getList({ limit, offset });
  }

  // ---------------------------------------------------------------- GET DATA BY UUID
  @ApiOperation({ summary: 'Get file data by uuid' })
  @ApiResponse({ status: 200, type: File_DTO })
  @Get(':uuid')
  async getFileData(@Param() param: File_ReqParam_DTO) {
    return this.files_svc.getFileData(param.uuid);
  }

  // ---------------------------------------------------------------- DELETE FILE
  @ApiOperation({ summary: 'Delete file by uuid' })
  @ApiResponse({ status: 200, type: File_DTO })
  @Delete('delete/:uuid')
  async deleteFile(@Param() param: File_ReqParam_DTO) {
    return this.files_svc.deleteFile(param.uuid);
  }

  // ---------------------------------------------------------------- DOWNLOAD FILE
  @ApiOperation({ summary: 'Download file by uuid' })
  @ApiResponse({ status: 200 })
  @Get('download/:uuid')
  async downloadFile(
    @Param() param: File_ReqParam_DTO,
    @Res({ passthrough: true }) response: Response,
  ):Promise<StreamableFile> {
    const file_data = await this.files_svc.getFileData(param.uuid);
    const file = createReadStream(join(process.cwd(), `./files/${file_data.name}`));

    response.set({
      'Content-Type': file_data.mime_type,
      'Content-Disposition': `attachment; filename="${file_data.name}"`,
    });
    return new StreamableFile(file);
  }

  // ---------------------------------------------------------------- UPDATE FILE
  @ApiOperation({ summary: 'Update file by uuid' })
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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      },
    }),
  }))
  @Put('update/:uuid')
  async updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: IReq,
    @Param() param: File_ReqParam_DTO,
  ) {
    return this.files_svc.updateFile({
      uuid: param.uuid,
      file_data: {
        owner_uuid: req.user.uuid,
        filename: file.filename,
        ext: path.extname(file.originalname),
        mime_type: file.mimetype,
        file_size: file.size,
      },
    });
  }
}

interface IReq {
  user: {
    uuid: string;
  };
}
