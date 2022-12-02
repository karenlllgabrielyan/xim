import { ApiProperty } from '@nestjs/swagger';


export class File_DTO {
  @ApiProperty({ example: '8a474ef9-8350-4c04-b6bd-8d121a417c60', description: 'File\'s uuid' })
    uuid: string;

  @ApiProperty({ example: 'filename', description: 'File\'s name' })
    name: string;

  @ApiProperty({ example: '.png', description: 'File\'s extension' })
    ext: string;

  @ApiProperty({ example: 'image/jpeg', description: 'File\'s mime type' })
    mime_type: string;

  @ApiProperty({ example: '30kB', description: 'File\'s size' })
    file_size: string;

  @ApiProperty({ example: '8a474ef9-8350-4c04-b6bd-8d121a417c60', description: 'Owner uuid' })
    owner_uuid: string;

  @ApiProperty({ example: '2022-12-10', description: 'Uploaded date' })
    uploaded: Date;
}
