import { ApiProperty } from '@nestjs/swagger';


export class File_getMany_ReqQuery_DTO {
  @ApiProperty({ example: 1, description: 'Page number' })
    page: number;

  @ApiProperty({ example: 10, description: 'Files limit' })
    limit: number;
}
