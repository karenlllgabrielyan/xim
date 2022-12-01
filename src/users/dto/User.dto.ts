import { ApiProperty } from '@nestjs/swagger';


export class User_DTO {
  @ApiProperty({ example: '8a474ef9-8350-4c04-b6bd-8d121a417c60', description: 'User\'s uuid' })
    uuid: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'User\'s email' })
    email: string;

  @ApiProperty({ example: 'John', description: 'User\'s name' })
    name: string;

  @ApiProperty({ example: 'Smith', description: 'User\'s surname' })
    surname: string;
}
