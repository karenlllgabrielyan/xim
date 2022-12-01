import { ApiProperty } from '@nestjs/swagger';


export class User_login_DTO {
  @ApiProperty({ example: 'user@gmail.com', description: 'User\'s email' })
    email: string;

  @ApiProperty({ example: 'user1234', description: 'User\'s password' })
    password: string;
}
