import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User_register_DTO } from '../authorization/dto/User.register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { User_DTO } from './dto/User.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) { }

  async __transformToUserDTO(users: Array<UsersEntity>)
    :Promise<Array<User_DTO>> {
    return users.map(user => ({
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      surname: user.surname,
    }));
  }

  // ----------------------------------------------------------------------------- REGISTER
  async createUser(args: User_register_DTO) {
    await this.__isUnique(args.email);

    const uuid = randomUUID();
    const hashed_password = await bcrypt.hash(args.password, 5);
    const user = new UsersEntity(uuid);

    user.email = args.email;
    user.password = hashed_password;
    user.name = args.name;
    user.surname = args.surname;

    await this.userRepository.save(user);
    return 'Registered successfully';
  }


  // ----------------------------------------------------------------------------- GET MY PROFILE
  async getMyProfile(uuid: string)
    :Promise<User_DTO> {
    const user = await this.userRepository.findOne({ where: { uuid } });
    return (await this.__transformToUserDTO([user]))[0];
  }

  // ----------------------------------------------------------------------------- GET USER BY EMAIL
  async getByEmail(email: string) {
    const user = this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('User with such email not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // --------------------------------------------------------------------------- IS UNIQUE
  async __isUnique(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new HttpException('User with such email already exist', HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
