import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt_svc: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const auth_header = req.headers.authorization;
      const bearer = auth_header.split(' ')[0];
      const token = auth_header.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User is not authorized' });
      }

      req.user = this.jwt_svc.verify(token);
      return true;
    }
    catch (e) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }
  }
}
