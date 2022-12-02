import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User_register_DTO } from './dto/User.register.dto';
import * as bcrypt from 'bcryptjs';
import { User_login_DTO } from './dto/User.login.dto';
import { JwtService } from '@nestjs/jwt';
import { User_DTO } from '../users/dto/User.dto';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthorizationService {
  constructor(
    private readonly jwt_svc: JwtService,
    private readonly user_svc: UsersService,
  ) { }

  // ----------------------------------------------------------------------------- REGISTER
  async register(args: User_register_DTO) {
    return await this.user_svc.createUser(args);
  }


  // ----------------------------------------------------------------------------- LOGIN
  async login(args: User_login_DTO) {
    const user = await this.__validateUser(args);
    return await this.__generateToken(user);
  }

  // --------------------------------------------------------------------------- VALIDATE USER
  private async __validateUser(args: User_login_DTO) {
    const user = await this.user_svc.getByEmail(args.email);

    if (!user) {
      throw new HttpException('User with such email not found', HttpStatus.NOT_ACCEPTABLE);
    }

    const password_equals = await bcrypt.compare(args.password, user.password);
    if (password_equals) {
      return user;
    }
    throw new HttpException('Wrong password', HttpStatus.NOT_ACCEPTABLE);
  }

  // --------------------------------------------------------------------------- GENERATE TOKEN
  private async __generateToken(user: User_DTO) {
    const payload = {
      name: user.name,
      uuid: user.uuid,
      email: user.email,
    };

    return {
      token: this.jwt_svc.sign(payload),
    };
  }
}
