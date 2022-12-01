import { User_DTO } from './User.dto';
import { ApiProperty } from '@nestjs/swagger';


export class User_ResBody_DTO {
  @ApiProperty({ example: User_DTO, description: 'User data' })
    user: User_DTO;
}
