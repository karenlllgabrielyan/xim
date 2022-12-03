import { ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../users/users.service';


@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private user_svc: UsersService,
    private jwt_svc: JwtService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const auth_header = req.headers.authorization;
      const bearer = auth_header.split(' ')[0];
      const token = auth_header.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User is not authorized' });
      }

      req.user = this.jwt_svc.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const user = await this.user_svc.getById(req.user.uuid);
      const match_token = await bcrypt.compare(token, user.access_token);
      if (!match_token) {
        throw new HttpException('Denied', HttpStatus.NOT_ACCEPTABLE);
      }
      return true;
    }
    catch (e) {
      throw new HttpException('Access denied', HttpStatus.ACCEPTED);
    }
  }
}
