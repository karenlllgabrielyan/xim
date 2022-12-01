import { ApiProperty } from '@nestjs/swagger';


export class User_register_DTO {
  @ApiProperty({ example: 'user@gmail.com', description: 'User\'s email' })
    email: string;

  @ApiProperty({ example: 'user1234', description: 'User\'s password' })
    password: string;

  @ApiProperty({ example: 'John', description: 'User\'s name' })
    name: string;

  @ApiProperty({ example: 'Smith', description: 'User\'s surname' })
    surname: string;
}
