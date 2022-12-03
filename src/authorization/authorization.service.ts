import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User_register_DTO, User_login_DTO } from './dto';
import * as bcrypt from 'bcryptjs';
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
    const tokens = await this.__generateTokens(user);
    await this.__updateRefreshToken({
      user_uuid: user.uuid,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
    return tokens ;
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
  private async __generateTokens(user: User_DTO) {
    const payload = {
      name: user.name,
      uuid: user.uuid,
      email: user.email,
    };

    return {
      access_token: await this.jwt_svc.signAsync(
        payload,
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '10m',
        },
      ),
      refresh_token: await this.jwt_svc.signAsync(
        payload,
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '1d',
        },
      ),
    };
  }

  // --------------------------------------------------------------------------- NEW TOKEN
  async newToken(args: { user_uuid: string; refresh_token: string }) {
    const user = await this.user_svc.getById(args.user_uuid);

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access denied');
    }

    const token_match = await bcrypt.compare(args.refresh_token, user.refresh_token);

    if (!token_match) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.__generateTokens(user);
    await this.__updateRefreshToken({
      user_uuid: args.user_uuid,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
    return tokens;
  }

  // --------------------------------------------------------------------------- UPDATE TOKEN
  private async __updateRefreshToken(args: {
    user_uuid: string;
    refresh_token: string;
    access_token: string;
  }) {
    const hashed_refresh = !args.refresh_token ? null : await bcrypt.hash(args.refresh_token, 5);
    const hashed_access = !args.refresh_token ? null : await bcrypt.hash(args.access_token, 5);
    await this.user_svc.__updateTokens({
      uuid: args.user_uuid,
      refresh_token: hashed_refresh,
      access_token: hashed_access,
    });
  }

  // --------------------------------------------------------------------------- LOGOUT
  async logout(user_uuid: string) {
    return await this.__updateRefreshToken({
      user_uuid,
      access_token: null,
      refresh_token: null,
    });
  }
}
