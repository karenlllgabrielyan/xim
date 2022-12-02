import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User_login_DTO, User_register_DTO } from './dto';
import { AuthorizationService } from './authorization.service';


@ApiTags('Authorization')
@Controller('authorization')
export class AuthorizationController {
  constructor(private auth_svc: AuthorizationService) { }

  @Post('/signup')
  register(@Body() args: User_register_DTO) {
    return this.auth_svc.register(args);
  }

  @Post('/signin')
  async login(@Body() args: User_login_DTO) {
    return this.auth_svc.login(args);
  }
}
