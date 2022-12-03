import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User_register_DTO } from '../authorization/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) { }

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

  // ----------------------------------------------------------------------------- GET USER BY EMAIL
  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('User with such email not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // ----------------------------------------------------------------------------- GET USER BY ID
  async getById(uuid: string) {
    return await this.userRepository.findOne({
      where: {
        uuid,
      },
    });
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

  // --------------------------------------------------------------------------- UPDATE REFRESH TOKEN
  async __updateTokens(args: {
    uuid: string;
    refresh_token: string;
    access_token: string;
  }) {
    const user = await this.userRepository.findOne({
      where: {
        uuid: args.uuid,
      },
    });

    if (!user) {
      throw new HttpException('User with such uuid not found', HttpStatus.NOT_FOUND);
    }

    user.access_token = args.access_token;
    user.refresh_token = args.refresh_token;
    await this.userRepository.save(user);
  }
}
